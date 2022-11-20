async function feed (parent,args,context) {
  return await context.prisma.link.findMany();
}


module.exports = {
  feed,
};
