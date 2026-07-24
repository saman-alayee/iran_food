import { getSiteContent, updateSiteContent } from '../services/contentService.js';

export async function getContent(_req, res) {
  const content = await getSiteContent();
  res.json({ success: true, data: content });
}

export async function saveContent(req, res, next) {
  try {
    const content = await updateSiteContent(req.body?.content ?? req.body);
    res.json({
      success: true,
      message: 'محتوای سایت با موفقیت ذخیره شد',
      data: content,
    });
  } catch (error) {
    next(error);
  }
}
