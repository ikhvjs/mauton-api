module.exports = {
    isCategorySeqValidNumber:  function (categorySeq) {
        return ((categorySeq<0||categorySeq>1000)?false:true)
    }

}