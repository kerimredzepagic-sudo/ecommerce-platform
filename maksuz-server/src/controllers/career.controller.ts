import { Request, Response, NextFunction } from 'express';
import { careerService } from '../services';
import { toCareerDTO, toCareerListDTOs } from '../views';
import { sendSuccess, sendCreated, sendNoContent, sendError, sendPaginated, sendNotFound } from '../utils';
import { AuthenticatedRequest } from './auth.controller';
import { EmploymentType } from '../models';

class CareerController {
  // ============ PUBLIC ENDPOINTS ============

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        page = '1', 
        limit = '10', 
        department, 
        location, 
        employmentType, 
        search 
      } = req.query;

      const { careers, total } = await careerService.getPublicCareers({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        department: department as string,
        location: location as string,
        employmentType: employmentType as EmploymentType,
        search: search as string,
      });

      sendPaginated(
        res,
        toCareerListDTOs(careers),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const career = await careerService.getBySlug(slug);

      if (!career) {
        sendNotFound(res, 'Pozicija nije pronađena');
        return;
      }

      sendSuccess(res, toCareerDTO(career));
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '5' } = req.query;
      const careers = await careerService.getFeatured(parseInt(limit as string, 10));
      sendSuccess(res, toCareerListDTOs(careers));
    } catch (error) {
      next(error);
    }
  }

  async getDepartments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await careerService.getDepartments();
      sendSuccess(res, departments);
    } catch (error) {
      next(error);
    }
  }

  async getLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locations = await careerService.getLocations();
      sendSuccess(res, locations);
    } catch (error) {
      next(error);
    }
  }

  // ============ ADMIN ENDPOINTS ============

  async getAllAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { 
        page = '1', 
        limit = '10', 
        department, 
        location, 
        employmentType, 
        search, 
        isActive, 
        isFeatured 
      } = req.query;

      const { careers, total } = await careerService.getAll({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        department: department as string,
        location: location as string,
        employmentType: employmentType as EmploymentType,
        search: search as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      });

      sendPaginated(
        res,
        toCareerListDTOs(careers),
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        total
      );
    } catch (error) {
      next(error);
    }
  }

  async getByIdAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const career = await careerService.getById(id);

      if (!career) {
        sendNotFound(res, 'Pozicija nije pronađena');
        return;
      }

      sendSuccess(res, toCareerDTO(career));
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const career = await careerService.create(req.body);
      sendCreated(res, toCareerDTO(career), 'Pozicija uspješno kreirana');
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const career = await careerService.update(id, req.body);

      if (!career) {
        sendNotFound(res, 'Pozicija nije pronađena');
        return;
      }

      sendSuccess(res, toCareerDTO(career), 'Pozicija uspješno ažurirana');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await careerService.delete(id);

      if (!deleted) {
        sendNotFound(res, 'Pozicija nije pronađena');
        return;
      }

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async toggleActive(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const career = await careerService.toggleActive(id);

      if (!career) {
        sendNotFound(res, 'Pozicija nije pronađena');
        return;
      }

      sendSuccess(res, toCareerDTO(career), `Pozicija ${career.isActive ? 'aktivirana' : 'deaktivirana'}`);
    } catch (error) {
      next(error);
    }
  }

  async toggleFeatured(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const career = await careerService.toggleFeatured(id);

      if (!career) {
        sendNotFound(res, 'Pozicija nije pronađena');
        return;
      }

      sendSuccess(res, toCareerDTO(career), `Pozicija ${career.isFeatured ? 'označena kao istaknuta' : 'uklonjena iz istaknutih'}`);
    } catch (error) {
      next(error);
    }
  }
}

export const careerController = new CareerController();
