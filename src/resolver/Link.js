// 誰によって投稿されたのかのリゾルバ
function postedBy(parent,args,context){
  return context.prisma.link.findUnique({
    where: {id: parent.id}
  }).postedBy();
}

function votes(parent,args,context){
  return context.prisma.link.findUnique({
    where: {id: parent.id}
  }).votes();
}





module.exports = {
  postedBy,
  votes
};

// 最後のpostedBy()はデータベースから取得して返している
// 外部キーと主キーの関係に注意
// データベースには外部キーしか入ってないから主キーを関連する関数を呼び出さないといけない
// レゾルバ−関数のネストに注意
