const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {APP_SECRET} = require("../utils");


// ユーザーの新規登録のリゾルバ
async function signup(parent,args,context){
  // パスワードの設定(ライブラリのインストールnpm i bcryptjs)10はソルト、パスワードをハッシュ化する際に前後に入れるもの、その後ハッシュ化
  const password = await bcrypt.hash(args.password,10);

  // ユーザーの新規作成（引数のパスワードをハッシュ化されたパスワードで上書きする処理も含む）
  const user = context.prisma.user.create({
    data: {
      ...args,
      password
    }
  });

  // jsonwebtokenによるトークン化(秘密鍵により、サーバー側では暗号化された文字列を複合できる)(signはトークン化)
  const token = jwt.sign({userId: user.id},APP_SECRET);

  return {
    token,
    user
  };
};




// ユーザーログイン
async function login(parent,args,context) {
  // ユーザーデータの取得
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email
    }
  });

  if (!user){
    throw new Error("そのようなユーザーはいません");
  }

  // パスワードの比較(変数にはboolen型が入る)
  const valid = await bcrypt.compare(args.password,user.password);

  if (!valid){
    throw new Error("無効なパスワードです");
  }

  // パスワードが正しいとき(もう一度tokenを署名（発行）)
  const token = jwt.sign({userId: user.id},APP_SECRET);

  return {
    token,
    user
  };
};



// ニュースを投稿するリゾルバ
async function post(parent,args,context) {
  const {userId} = context;

  const newLink = await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
      postedBy: {connect: {id: userId}}
    }
  });

  // 送信
  context.pubsub.publish("NEW_LINK",newLink);

  return newLink;

};


async function vote(parent,args,context){
  const userId = context.userId;

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  });

  // 一個人の２回めの投稿を防ぐ
  if (Boolean(vote)){
    throw new Error(`あなたは既にその投稿に投票しています：${args.linkId}`);
  }

  // 投票する
  const newVote = await context.prisma.vote.create({
    data: {
      user: {connect: {id: userId}},
      link: {connect: {id: Number(args.linkId)}}
    }
  });


  // 送信
  context.pubsub.publish("NEW_VOTE",newVote);

  return newVote;
  
}






module.exports = {
  signup,
  login,
  post,
  vote
};




