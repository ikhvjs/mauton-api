module.exports = {
    isMenu1MandatoryFieldNotFilled:  function (menu1Name, menu1Seq) {
        return (!menu1Name || !menu1Seq)
    }

}