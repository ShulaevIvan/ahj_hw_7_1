import { PopupWarning } from '../popup/popup';
import Popup from '../popup/popup';

export default class TicketManager {
    constructor(){
        this.allTikets = [];
        this.warning = new PopupWarning(
            '.popup-rm-ticket',
            '.popup-warning-cancel-btn',
            '.popup-warning-btn', 
            '.popup-show',
            '.popup-hidden',
        );
        this.popup = new Popup(
            '.popup-add-ticket', 
            '.add-ticket-btn', 
            '.popup-cancel-ticket-btn',
            '.popup-add-ticket-btn',
            '.popup-show', 
            '.popup-hidden',
        );
        this.create = this.create.bind(this);

       
        this.removeTicketEvent = (e) => {
            e.preventDefault();
            e.stopPropagation()
            const removeTarget = e.target;
            this.warning.show();
            const warningPopupEvent = (e) => {
                e.preventDefault();
                e.stopPropagation()
                console.log('1')
                if (e.target && e.target.classList.contains('popup-warning-btn')) {
                    console.log(removeTarget)
                    const ticket = removeTarget.closest('.ticket')
                    const id = ticket.getAttribute('ticketId');
                    ticket.remove();
                    this.removeTicketReq(id);
                    this.warning.popup.removeEventListener('click', warningPopupEvent)
                }
            this.warning.popup.removeEventListener('click', warningPopupEvent)    
            }
            this.warning.popup.addEventListener('click', warningPopupEvent);
        }

        this.editTicketEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const editTarget  = e.target;
            const ticket = editTarget.closest('.ticket');
            const id = ticket.getAttribute('ticketId');
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${id}`);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send();
            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const targetTicket = JSON.parse(xhr.response)
                    this.popup.edit(targetTicket);
                }
            });
           
            // this.patchTicketReq(id);
        };

    }

    getTickets(){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:7070/?method=allTickets');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const tickets = JSON.parse(xhr.response);
                this.create(tickets);
            }
        });
    }


    createTicketReq(data) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:7070/?method=createTicket');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(data));
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 201) {
                console.log('ready');
                this.create(JSON.parse(xhr.response));
            }
        });
    };

    removeTicketReq(ticketId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:7070/?method=deleteTicketById&id=${ticketId}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log('ready');
            }
        });
    }

    patchTicketReq(ticketId) {
        const createTime = new Date().toLocaleString()
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${ticketId}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const targetTicket = JSON.parse(xhr.response)
                console.log(targetTicket)
                // xhr = new XMLHttpRequest();
                // xhr.open('PATCH', `http://localhost:7070/?method=updateTicketById&id=${ticketId}`);
                // xhr.setRequestHeader('Content-type', 'application/json');
                // xhr.send();
                // xhr.addEventListener('readystatechange', () => {
                //     if (xhr.readyState === 4 && xhr.status === 200) {
                //         console.log(xhr.response);
                //     }
                // });
            }
        });

    }


    create(data) {
        if (data.length > 0) {
            data.forEach((ticketData) => {
                const wrap = document.querySelector('.tickets-wrapper');
                const ticket = document.createElement('div');
                const ticketText = document.createElement('div');
                const ticketDate = document.createElement('div');
                const ticketControl = document.createElement('div');
                const edit = document.createElement('span');
                const remove = document.createElement('span');
                ticket.innerHTML = `<div class="ticket-chekbox">
                            <div class="checkbox">
                            <input type="checkbox" id="checkbox_${ticketData.id}">
                                <label for="checkbox_${ticketData.id}"></label>
                            </div> `
                ticket.setAttribute('ticketId', ticketData.id);
                ticket.classList.add('ticket');
                ticketText.classList.add('ticket-text');
                ticketDate.classList.add('ticket-date');
                ticketControl.classList.add('ticket-control');
                edit.classList.add('edit');
                remove.classList.add('remove');
                edit.addEventListener('click', this.editTicketEvent);
                remove.addEventListener('click', this.removeTicketEvent);
                ticketText.textContent = ticketData.description;
                ticketDate.textContent = ticketData.created;
                ticketControl.appendChild(edit);
                ticketControl.appendChild(remove);
                ticket.appendChild(ticketText)
                ticket.appendChild(ticketDate)
                ticket.appendChild(ticketControl)
                wrap.appendChild(ticket)
            });
        }
        else if (data.length === undefined) {
            const wrap = document.querySelector('.tickets-wrapper');
            const ticket = document.createElement('div');
            const ticketText = document.createElement('div');
            const ticketDate = document.createElement('div');
            const ticketControl = document.createElement('div');
            const edit = document.createElement('span');
            const remove = document.createElement('span');
            ticket.innerHTML = `<div class="ticket-chekbox">
                            <div class="checkbox">
                            <input type="checkbox" id="checkbox_2">
                                <label for="checkbox_2"></label>
                            </div> `
            ticket.setAttribute('ticketId', data.id);
            ticket.classList.add('ticket');
            ticketText.classList.add('ticket-text');
            ticketDate.classList.add('ticket-date');
            ticketControl.classList.add('ticket-control');
            edit.classList.add('edit');
            edit.addEventListener('click', this.editTicketEvent);
            remove.classList.add('remove');
            remove.addEventListener('click', this.removeTicketEvent);
            ticketText.textContent = data.description;
            ticketDate.textContent = data.created;
            ticketControl.appendChild(edit);
            ticketControl.appendChild(remove);
            ticket.appendChild(ticketText);
            ticket.appendChild(ticketDate);
            ticket.appendChild(ticketControl);
            wrap.appendChild(ticket);
        }
    }

}