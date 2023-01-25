export default class PopupWarning {
  constructor(popupTag, closeBtn, okBtn, showClass, hideClass) {
    this.popup = document.querySelector(popupTag);
    this.cancelBtn = this.popup.querySelector(closeBtn);
    this.okBtn = this.popup.querySelector(okBtn);
    this.showClass = showClass.replace('.', '');
    this.hideClass = hideClass.replace('.', '');

    this.hideWarning = (e) => {
      e.preventDefault();
      if (e.target && e.target.classList.contains(closeBtn.replace('.', '')) && this.popup.classList.contains('popup-show')) {
        this.hide();
        e.target.removeEventListener('click', this.okBtn);
      }
    };

    this.okWarning = (e) => {
      e.preventDefault();
      if (e.target && e.target.classList.contains(okBtn.replace('.', '')) && this.popup.classList.contains('popup-show')) {
        this.hide();
        e.target.removeEventListener('click', this.hideWarning);
      }
    };
    this.okBtn.addEventListener('click', this.okWarning);
    this.cancelBtn.addEventListener('click', this.hideWarning);
  }

  show() {
    this.popup.classList.remove(this.hideClass);
    this.popup.classList.add(this.showClass);
  }

  hide() {
    this.popup.classList.remove(this.showClass);
    this.popup.classList.add(this.hideClass);
  }
}
