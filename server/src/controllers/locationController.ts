import { Request, Response } from 'express';
import slugify from 'slugify';
import { Location } from '../models/Location';
import { Job } from '../models/Job';
import { AuthRequest } from '../middleware/auth';

export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { allStatus = 'false', popular } = req.query;
    const query: any = {};

    if (allStatus !== 'true') {
      query.status = 'published';
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    const locations = await Location.find(query).sort({ displayOrder: 1, city: 1 }).lean();

    // Dynamically calculate active jobs for each city
    const locIds = locations.map((l) => l._id);
    const jobsAgg = await Job.aggregate([
      { $match: { locationId: { $in: locIds }, status: 'published', deadline: { $gte: new Date() } } },
      { $group: { _id: '$locationId', count: { $sum: 1 } } },
    ]);

    const jobsMap = new Map(jobsAgg.map((j) => [String(j._id), j.count]));
    const result = locations.map((loc) => ({
      ...loc,
      jobsCount: jobsMap.get(String(loc._id)) || 0,
    }));

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { city, state = '', country = 'India', status = 'published', displayOrder = 0, isPopular = false } = req.body;

    if (!city) {
      res.status(400).json({ success: false, message: 'City name is required' });
      return;
    }

    const slug = slugify(city, { lower: true, strict: true });

    const existing = await Location.findOne({ slug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A location with this city name already exists' });
      return;
    }

    const location = await Location.create({
      city,
      state,
      country,
      slug,
      status,
      displayOrder: Number(displayOrder) || 0,
      isPopular: Boolean(isPopular),
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { city, state, country, status, displayOrder, isPopular } = req.body;

    const loc = await Location.findById(id);
    if (!loc) {
      res.status(404).json({ success: false, message: 'Location not found' });
      return;
    }

    if (city && city !== loc.city) {
      loc.city = city;
      loc.slug = slugify(city, { lower: true, strict: true });
      await Job.updateMany({ locationId: id }, { $set: { locationName: city } });
    }

    if (state !== undefined) loc.state = state;
    if (country !== undefined) loc.country = country;
    if (status) loc.status = status;
    if (displayOrder !== undefined) loc.displayOrder = Number(displayOrder);
    if (isPopular !== undefined) loc.isPopular = Boolean(isPopular);

    await loc.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: loc,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

