module.exports = {
    isMenu2MandatoryFieldNotFilled:  function (menu1Name, menu1Seq,menu2ParentMenuID) {
        return (!menu1Name || !menu1Seq ||!menu2ParentMenuID)
    }

}