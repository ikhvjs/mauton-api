module.exports = {
    isTagSeqValidNumber:  function (tagSeq) {
        return ((tagSeq<0||tagSeq>1000)?false:true)
    }

}