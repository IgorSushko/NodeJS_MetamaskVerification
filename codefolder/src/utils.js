module.exports.taketransactionHash = (strObj) => {
  const t1 = JSON.stringify(strObj.Receipt);
  const obj = JSON.parse(t1);
  return obj.transactionHash;
};

module.exports.blockNumber = (strObj) => {
  const t2 = JSON.stringify(strObj.Receipt);
  const obj = JSON.parse(t2);
  return obj.blockNumber;
};

module.exports.transactionIndex = (strObj) => {
  const t3 = JSON.stringify(strObj.Receipt);
  const obj = JSON.parse(t3);
  return obj.transactionIndex;
};
