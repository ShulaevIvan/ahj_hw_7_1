import TicketManager from '../ticketsmanager/manager';
export default class Popup {
    constructor(popupTag, btn, closeBtn, addDataBtn, showClass, hideClass){
        this.popup = document.querySelector(popupTag);
        this.addDataBtn = this.popup.querySelector(addDataBtn);
        this.popupBtn = document.querySelector(btn);
        this.popupCancel = this.popup.querySelector(closeBtn);
        this.btnClass = btn.replace('.', '');
        this.closeBtnClass = closeBtn.replace('.', '');
        this.addDataBtnClass = addDataBtn.replace('.', '');
        this.showClass = showClass.replace('.', '');
        this.hideClass = hideClass.replace('.', '');
        this.editData = undefined;

        this.popupCancel.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target;
            if (target && target.classList.contains(this.closeBtnClass) && this.popup.classList.contains(this.showClass)) {
                this.popup.querySelectorAll('input').forEach((item) => item.classList.remove('warning'));
                this.popup.querySelectorAll('input').forEach((item) => item.value = '');
                this.popup.querySelector('textarea').value = '';
                this.hide();
            }
        });

        this.popupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target;
            if (target && target.classList.contains(this.btnClass) && this.popup.classList.contains(this.hideClass)) {
                this.popup.querySelectorAll('input').forEach((item) => item.classList.remove('warning'));
                this.popup.querySelectorAll('input').forEach((item) => item.value = '');
                this.popup.querySelector('textarea').value = '';
                this.show(e);
            }
        });

        this.addDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target;
            if  (target && target.classList.contains(this.addDataBtnClass)) {
                this.checkFromAddTicket();
            }
        });
    }


    checkFromAddTicket()  {
        const ticketDescription = this.popup.querySelector('.description');
        const ticketDescriptionFull = this.popup.querySelector('.description-full');
        const editParam = this.popup.getAttribute('edit');
        
        if (ticketDescription.value.trim().length === 0 && this.editData === undefined) {
            ticketDescription.classList.add('warning');
            return false;
        }
        else if (editParam == 'false' && this.editData === undefined) {
            const date = new Date().toLocaleString();
            const data = {
                id: null,
                description: ticketDescription.value,
                descriptionFull: ticketDescriptionFull.value,
                status: false,
                date: date,
            }
            ticketDescription.classList.remove('warning');
            this.hide();
            return data
        }

        if (editParam == 'true') {
            const description = document.querySelector('.description');
            const descriptionFull = document.querySelector('.description-full');
            const date = new Date().toLocaleString();
            const data = {
                id: this.editData.id,
                description: description.value,
                descriptionFull: descriptionFull.value,
                status: undefined,
                date: date,
            }

            this.editData = data;
            ticketDescription.classList.remove('warning');
            this.popup.removeAttribute('edit');
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PATCH', `http://localhost:7070/?method=updateTicketById&id=${this.editData.id}`);
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.send(JSON.stringify(this.editData));
                xhr.addEventListener('readystatechange', () =>{
                    if (xhr.readyState == 4 && xhr.status === 200) {
                        document.querySelectorAll('.ticket').forEach((item) => item.remove());
                        this.hide();
                        new TicketManager().getTickets();
                        resolve();
                    }
                    else if (xhr.status === 400) {
                        reject();
                    }
                });
            });
            
        }
    }

    show(e) {
        this.popup.classList.remove(this.hideClass);
        this.popup.classList.add(this.showClass);
        this.popup.setAttribute('edit', false);
    }

    hide() {
        this.popup.classList.remove(this.showClass);
        this.popup.classList.add(this.hideClass);
        this.popup.setAttribute('edit', false);
    }

    edit(ticket) {
        this.editData = ticket;
        const ticketsTags = document.querySelectorAll(`[ticketid]`);
        this.popup.setAttribute('edit', true);
        ticketsTags.forEach((item) => {
            if (item.getAttribute('ticketid') == ticket.id)  {
                const editTicket = item;
                editTicket.setAttribute('edit', true);
            }
        })
        const description = document.querySelector('.description');
        const descriptionFull = document.querySelector('.description-full');
        const title = document.querySelector('.ticket-title');
        title.textContent = 'Изменить тикет';
        description.value = ticket.description;
        descriptionFull.value = ticket.descriptionFull;
        this.popup.classList.remove(this.hideClass);
        this.popup.classList.add(this.showClass);
    }
}

export class PopupWarning {
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
                e.target.removeEventListener('click', this.okBtn)
            }
        }

        this.okWarning = (e) => {
            e.preventDefault();
            if (e.target && e.target.classList.contains(okBtn.replace('.', '')) && this.popup.classList.contains('popup-show')) {
                this.hide();
                e.target.removeEventListener('click', this.hideWarning)
            }
        }
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