import { PopupWarning } from '../popup/popup';
import Popup from '../popup/popup';

export default class TicketManager {
    constructor(){
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
                const target = e.target;
                e.preventDefault();
                e.stopPropagation();
                if (target && target.classList.contains('popup-warning-btn')) {
                    const ticket = removeTarget.closest('.ticket')
                    const id = ticket.getAttribute('ticketId');
                    this.removeTicketReq(id);
                    ticket.remove();
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
            const xhr = this.getTicketByIdReq(id);
            xhr.send();
            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const targetTicket = JSON.parse(xhr.response);
                    this.popup.edit(targetTicket);
                }
            });
        };

        this.checkboxEvent = (e) => {
            let status = e.target.getAttribute('status');
            
            const checkbox = e.target;
            const id = Number(checkbox.getAttribute('id').replace('checkbox_', ''));
            if (checkbox.checked) {
                status = true;
                e.target.setAttribute('status', true);
                let xhr = this.getTicketByIdReq(id);
                xhr.send();
                xhr.addEventListener('readystatechange', () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const targetTicket = JSON.parse(xhr.response);
                        targetTicket.status = true
                        xhr = new XMLHttpRequest();
                        xhr.open('PATCH', `http://localhost:7070/?method=updateTicketById&id=${id}`);
                        xhr.setRequestHeader('Content-type', 'application/json');
                        xhr.send(JSON.stringify(targetTicket));
                        xhr.addEventListener('readystatechange', () =>{
                            if (xhr.readyState == 4 && xhr.status === 200) {
                                document.querySelectorAll('.ticket').forEach((item) => item.remove());
                                this.getTickets();
                            }
                        });
                    }
                });
            }
            else {
                status = false;
                e.target.setAttribute('status', status);
                let xhr = this.getTicketByIdReq(id);
                xhr.send();
                xhr.addEventListener('readystatechange', () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const targetTicket = JSON.parse(xhr.response);
                        targetTicket.status = false;
                        xhr = new XMLHttpRequest();
                        xhr.open('PATCH', `http://localhost:7070/?method=updateTicketById&id=${id}`);
                        xhr.setRequestHeader('Content-type', 'application/json');
                        xhr.send(JSON.stringify(targetTicket));
                        xhr.addEventListener('readystatechange', () =>{
                            if (xhr.readyState == 4 && xhr.status === 200) {
                                document.querySelectorAll('.ticket').forEach((item) => item.remove());
                                this.getTickets();
                            }
                        });
                    }
                });
                checkbox.checked = false;
            }
        }
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
        console.log(data)
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


    getTicketByIdReq(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${id}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        return xhr
    }


 
    create(data) {
        if (data.length >= 1) {
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
                            <input class="checkbox_${ticketData.id}" type="checkbox" id="checkbox_${ticketData.id}">
                                <label class="checkbox_${ticketData.id}" for="checkbox_${ticketData.id}"></label>
                            </div> `
                const checkbox = ticket.querySelector(`.checkbox_${ticketData.id}`);
                console.log(ticketData)
                if (ticketData.status) {
                    checkbox.setAttribute('status', true)
                    checkbox.click();
                }
                else {
                    checkbox.setAttribute('status', false);
                }
                ticket.setAttribute('ticketId', ticketData.id);
                ticket.classList.add('ticket');
                ticketText.classList.add('ticket-text');
                ticketDate.classList.add('ticket-date');
                ticketControl.classList.add('ticket-control');
                edit.classList.add('edit');
                remove.classList.add('remove');
                checkbox.addEventListener('click', this.checkboxEvent)
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
        if (data.length === undefined) {
            const wrap = document.querySelector('.tickets-wrapper');
            const ticket = document.createElement('div');
            const ticketText = document.createElement('div');
            const ticketDate = document.createElement('div');
            const ticketControl = document.createElement('div');
            const edit = document.createElement('span');
            const remove = document.createElement('span');
            ticket.innerHTML = `<div class="ticket-chekbox">
            <div class="checkbox">
            <input class="checkbox_${data.id}" type="checkbox" id="checkbox_${data.id}">
                <label class="checkbox_${data.id}" for="checkbox_${data.id}"></label>
            </div> `;
            const checkbox = ticket.querySelector(`.checkbox_${data.id}`);
            if (data.status) {
                checkbox.setAttribute('status', true)
                checkbox.click();
            }
            else {
                checkbox.setAttribute('status', false);
            }
            ticket.setAttribute('ticketId', data.id);
            ticket.classList.add('ticket');
            ticketText.classList.add('ticket-text');
            ticketDate.classList.add('ticket-date');
            ticketControl.classList.add('ticket-control');
            edit.classList.add('edit');
            checkbox.addEventListener('click', this.checkboxEvent);
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