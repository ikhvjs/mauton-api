module.exports = {
    isBlogSeqValidNumber:  function (blogSeq) {
        return ((blogSeq<0||blogSeq>1000)?false:true)
    }

}