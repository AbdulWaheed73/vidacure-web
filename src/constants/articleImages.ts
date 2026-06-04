// Article cover images, shared by the Journal cards and the Article page.
// Each cover ships a WebP (served first) with a JPEG fallback via <picture>.
import whatIsObesityJpg from '@/assets/what-is-obesity.jpg';
import whatIsObesityWebp from '@/assets/what-is-obesity.webp';
import treatingObesityJpg from '@/assets/Treating-Obesity.jpg';
import treatingObesityWebp from '@/assets/Treating-Obesity.webp';
import girlsJpg from '@/assets/girls.jpg';
import girlsWebp from '@/assets/girls.webp';
import nutritionObesityJpg from '@/assets/nutrition-obesity.jpg';
import nutritionObesityWebp from '@/assets/nutrition-obesity.webp';
import exerciseObesityJpg from '@/assets/exercise-obesity.jpg';
import exerciseObesityWebp from '@/assets/exercise-obesity.webp';

export type ArticleCover = { webp: string; jpg: string };

export const articleCovers: Record<string, ArticleCover> = {
  'what-is-obesity': { webp: whatIsObesityWebp, jpg: whatIsObesityJpg },
  'treating-obesity': { webp: treatingObesityWebp, jpg: treatingObesityJpg },
  'women-health-obesity': { webp: girlsWebp, jpg: girlsJpg },
  'nutrition-obesity': { webp: nutritionObesityWebp, jpg: nutritionObesityJpg },
  'exercise-obesity': { webp: exerciseObesityWebp, jpg: exerciseObesityJpg },
};
