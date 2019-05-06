module.exports.taketransactionHash = (strObj) => {
  const t1 = JSON.stringify(strObj.Receipt);
  const obj = JSON.parse(t1);
  return obj.transactionHash;
};
