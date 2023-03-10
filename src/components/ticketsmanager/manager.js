import PopupWarning from '../popup/popupWarning';
import Popup from '../popup/popup';

export default class TicketManager {
  constructor() {
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

    this.showDescription = (e) => {
      e.preventDefault();
      const target = e.target;
      const ticket = target.closest('.ticket');
      const ticketFullStatus = target.getAttribute('ticketDescFull');

      if (ticketFullStatus === 'true' && target.classList.contains('ticket-text')) {
        const ticketId = ticket.getAttribute('ticketid');
        ticket.setAttribute('ticketDescFull', false);
        const promise = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `http://localhost:7070/?ticketById&id=${ticketId}`);
          xhr.send();
          xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              resolve(xhr.response);
            } else if (xhr.status === 400) reject();
          });
        }).then((data) => {
          const ticketData = JSON.parse(data);
          this.createDescriptionFull(ticketData, ticket);
        });
      } else {
        this.removeDesciprionFull(ticket);
      }
    };

    this.removeTicketEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const removeTarget = e.target;
      this.warning.show();
      const warningPopupEvent = (evnt) => {
        const target = evnt.target;
        evnt.preventDefault();
        evnt.stopPropagation();
        if (target && target.classList.contains('popup-warning-btn')) {
          const ticket = removeTarget.closest('.ticket');
          const id = ticket.getAttribute('ticketId');
          this.removeTicketReq(id);
          ticket.remove();
          this.warning.popup.removeEventListener('click', warningPopupEvent);
        }
        this.warning.popup.removeEventListener('click', warningPopupEvent);
      };
      this.warning.popup.addEventListener('click', warningPopupEvent);
    };

    this.editTicketEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const editTarget = e.target;
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
            targetTicket.status = true;
            const promise = new Promise((resolve, reject) => {
              xhr = new XMLHttpRequest();
              xhr.open('PATCH', `http://localhost:7070/?method=updateTicketById&id=${id}`);
              xhr.setRequestHeader('Content-type', 'application/json');
              xhr.send(JSON.stringify(targetTicket));
              xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                  document.querySelectorAll('.ticket').forEach((item) => item.remove());
                  this.getTickets();
                  resolve();
                } else if (xhr.status === 400) reject();
              });
            });
          }
        });
      } else {
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
            xhr.addEventListener('readystatechange', () => {
              if (xhr.readyState === 4 && xhr.status === 200) {
                document.querySelectorAll('.ticket').forEach((item) => item.remove());
                this.getTickets();
              }
            });
          }
        });
        checkbox.checked = false;
      }
    };
  }

  getTickets() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:7070/?method=allTickets');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const tickets = JSON.parse(xhr.response);
          this.create(tickets);
          resolve();
        } else if (xhr.status !== 200) {
          reject();
        }
      });
    });
  }

  createTicketReq(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:7070/?method=createTicket');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4 && xhr.status === 201) {
          this.create(JSON.parse(xhr.response));
          resolve();
        } else if (xhr.status === 400) reject();
      });
    });
  }

  removeTicketReq(ticketId) {
    this.ticketId = ticketId;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', `http://localhost:7070/?method=deleteTicketById&id=${this.ticketId}`);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve();
        } else if (xhr.status === 400) reject();
      });
    });
  }

  getTicketByIdReq(id) {
    this.id = id;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${this.id}`);
    xhr.setRequestHeader('Content-type', 'application/json');
    return xhr;
  }

  create(data) {
    this.data = data;
    if (data.id) this.data = [data];
    if (this.data) {
      this.data.forEach((ticketData) => {
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
                            </div> `;
        const checkbox = ticket.querySelector(`.checkbox_${ticketData.id}`);
        if (ticketData.status) {
          checkbox.setAttribute('status', true);
          checkbox.click();
        } else checkbox.setAttribute('status', false);

        ticket.setAttribute('ticketId', ticketData.id);
        ticket.classList.add('ticket');
        ticketText.classList.add('ticket-text');
        ticketDate.classList.add('ticket-date');
        ticketControl.classList.add('ticket-control');
        edit.classList.add('edit');
        remove.classList.add('remove');
        checkbox.addEventListener('click', this.checkboxEvent);
        edit.addEventListener('click', this.editTicketEvent);
        remove.addEventListener('click', this.removeTicketEvent);
        ticketText.addEventListener('click', this.showDescription);
        ticketText.setAttribute('ticketDescFull', true);
        ticketText.textContent = ticketData.description;
        ticketDate.textContent = ticketData.created;
        ticketControl.appendChild(edit);
        ticketControl.appendChild(remove);
        ticket.appendChild(ticketText);
        ticket.appendChild(ticketDate);
        ticket.appendChild(ticketControl);
        wrap.appendChild(ticket);
      });
    }
  }

  createDescriptionFull(data, ticket) {
    this.ticketTag = ticket;
    const ticketText = this.ticketTag.querySelector('.ticket-text');
    const ticketCheckbox = this.ticketTag.querySelector('.ticket-chekbox');
    const ticketDate = this.ticketTag.querySelector('.ticket-date');
    const ticketControl = this.ticketTag.querySelector('.ticket-control');
    ticketText.classList.add('ticket-full-description-align');
    ticketText.textContent = '';
    this.ticketDesc = ticketText;
    this.ticketData = data;

    const ticketFullDescWrap = document.createElement('div');
    const ticketFullDescTitle = document.createElement('div');
    const ticketFullDesciption = document.createElement('div');

    ticketFullDescTitle.textContent = this.ticketData.description;
    ticketFullDesciption.textContent = this.ticketData.descriptionFull;
    ticketFullDescTitle.classList.add('ticket-full-desc-title');
    ticketFullDescWrap.classList.add('ticket-full-desc-wrap');
    ticketFullDesciption.classList.add('ticket-full-description');

    ticketFullDescWrap.appendChild(ticketFullDescTitle);
    ticketFullDescWrap.appendChild(ticketFullDesciption);
    this.ticketDesc.appendChild(ticketFullDescWrap);

    ticketCheckbox.classList.add('ticket-full-description-align');
    ticketDate.classList.add('ticket-full-description-align');
    ticketControl.classList.add('ticket-full-description-align');
    ticketText.classList.add('ticket-full-description-align');
    this.ticket.setAttribute('ticketDescFull', false);
  }

  removeDesciprionFull(ticketTag) {
    this.ticket = ticketTag;
    this.ticketText = this.ticket.querySelector('.ticket-text');

    const ticketCheckbox = this.ticketTag.querySelector('.ticket-chekbox');
    const ticketDate = this.ticketTag.querySelector('.ticket-date');
    const ticketControl = this.ticketTag.querySelector('.ticket-control');
    const newTitle = this.ticket.querySelector('.ticket-full-desc-title').textContent;
    const title = this.ticket.querySelector('.ticket-text');

    this.ticketText.firstChild.remove();
    title.textContent = newTitle;
    ticketCheckbox.classList.remove('ticket-full-description-align');
    ticketDate.classList.remove('ticket-full-description-align');
    ticketControl.classList.remove('ticket-full-description-align');
    this.ticketText.classList.remove('ticket-full-description-align');
    this.ticket.setAttribute('ticketDescFull', true);
  }
}
