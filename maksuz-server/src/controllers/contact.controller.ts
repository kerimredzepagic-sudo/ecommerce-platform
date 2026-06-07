import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services';
import { toContactDTO, toContactDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated, sendNotFound } from '../utils';

class ContactController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contact = await contactService.create(req.body);
      sendCreated(res, toContactDTO(contact), 'Message sent successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '20', status } = req.query;

      const { contacts, total } = await contactService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as any,
      });

      sendPaginated(
        res,
        toContactDTOs(contacts),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await contactService.getById(id);

      if (!contact) {
        sendNotFound(res, 'Contact message not found');
        return;
      }

      // Mark as read when viewing
      if (contact.status === 'new') {
        await contactService.markAsRead(id);
        contact.status = 'read';
      }

      sendSuccess(res, toContactDTO(contact));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contact = await contactService.updateStatus(id, status);

      if (!contact) {
        sendNotFound(res, 'Contact message not found');
        return;
      }

      sendSuccess(res, toContactDTO(contact), 'Status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await contactService.delete(id);

      if (!deleted) {
        sendNotFound(res, 'Contact message not found');
        return;
      }

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getNewCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await contactService.getNewCount();
      sendSuccess(res, { count });
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();

