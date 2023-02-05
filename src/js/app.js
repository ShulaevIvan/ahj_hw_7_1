import Popup from '../components/popup/popup';
import TicketManager from '../components/ticketsmanager/manager';

window.addEventListener('DOMContentLoaded', () => {
  const addTicketBtn = document.querySelector('.popup-add-ticket-btn');
  const ticketManager = new TicketManager();
  ticketManager.getTickets();

  const popupAddTicket = new Popup(
    '.popup-add-ticket',
    '.add-ticket-btn',
    '.popup-cancel-ticket-btn',
    '.popup-add-ticket-btn',
    '.popup-show',
    '.popup-hidden',
  );

  addTicketBtn.addEventListener('click', (e) => {
    const checkForm = popupAddTicket.checkFromAddTicket();
    if (checkForm && checkForm.editData === undefined) {
      ticketManager.createTicketReq(checkForm);
    }
  });
});
