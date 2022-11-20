const {ApolloServer,gql} = require("apollo-server");
const fs = require("fs");
const path = require("path");

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const { getUserId } = require("./utils");

// リゾルバ関係のファイル
const Query = require("./resolver/Query");
const Mutation = require("./resolver/Mutation");
const Subscription = require("./resolver/Subscription");
const Link = require("./resolver/Link");
const User = require("./resolver/User");
const Vote = require("./resolver/Vote");



// サブスクリプションの実装
// Publisher(送信者)/Subscriber(受信者)
const {PubSub} = require("apollo-server");
const pubsub = new PubSub();





// HackerNewsの１つ１つの投稿（本来ならデータベースから引っ張ってくるところをハードコーディング）
// let links = [
//   {
//     id: "link-0",
//     description: "GraphQLチュートリアル",
//     url: "http//localhost:5000"
//   }
// ]




// GraphQLスキーマの定義(!は返す値がnullはだめであることを明示している)(typeのQueryはapollo serverによって決まっている、何か情報を取得する)
// const typeDefs = gql`
// `;

// リゾルバ関数（定義したスキーマに実体のある値を入れていくもの）各関数は最後にreturnしなければならない、resolversとスキーマ定義の返す型の一致
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote
};

// ローカルサーバーの構築
// resolvers:resolversの略
// contextを引数に加えることでリゾルバ内でで指定した変数が使用可能になる
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname,"scheme.graphql"),"utf-8"),
  resolvers,
  context:({req})=>{
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null 
    };
  },
});


// ローカルサーバーの立ち上げ
server.listen().then(({url}) => console.log(`${url}でサーバーを起動中・・・・`));
// サーバーを立ち上げるには、ターミナルでnode ./src/server.js,するとplaygroundが立ち上がる、左でクエリを出し、右に返ってきたデータが表示される

// GraphQLはまずスキーマ（クエリと返す値の型定義）を定義し、レゾルバ関数を作って返す値を定義し、APIを叩く
// npx prisma studioでブラウザ上でデータベースをビジュアルで見れる







