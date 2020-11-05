module.exports = {
    isCategoryMandatoryFieldNotFilled:  function (categoryName, seq) {
        return (!categoryName||!seq)
    }

}