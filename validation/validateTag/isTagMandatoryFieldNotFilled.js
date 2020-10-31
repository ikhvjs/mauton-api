module.exports = {
    isTagMandatoryFieldNotFilled:  function (tagName, tagSeq) {
        return (!tagName || !tagSeq)
    }

}