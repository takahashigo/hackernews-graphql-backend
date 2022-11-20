const jwt = require("jsonwebtoken");
// 複合キー（秘密鍵）の作成
const APP_SECRET = "GraphQL-some3-awesome";


// トークンを複合するための関数
function getTokenPayload(token){
  // トークン化された物の前の情報（user.id)を複合する。
  return jwt.verify(token,APP_SECRET);
}




// ユーザーIDを取得するための関数
function getUserId(req,authToken) {
  if (req){
    // ヘッダーの確認。あなたは新規登録していますか？という認証権限がありますか？という確認
    const authHeader = req.headers.authorization;
    // 権限があるなら
    if (authHeader){
      const token = authHeader.replace("Bearer","");
      if (!token){
        throw new Error("トークンが見つかりません");
      }
      // そのトークンを複合（ランダムな文字列をランダムになる前の文字列に戻す）する。
      const {userId} = getTokenPayload(token);
      return userId;
    }
  } else if (authToken){
    const {userId} = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません。");
}


module.exports = {
  APP_SECRET,
  getUserId
}