/**
 * Cloudinary Image Public IDs
 *
 * Maps local image filenames to Cloudinary public IDs.
 * Since images are uploaded with same names, we just use the filename without extension.
 */

export const CloudinaryImages = {
  // Landing page images
  first: 'first_sz2wu6',
  second: 'second_kzn5cn',
  third: 'third_o3tsc4',
  fourth: 'fourth_ufrkl4',
  fifth: 'fifth_i1wrio',
  sixth: 'sixth_pc9bfb',
  phones: 'phones',

  // Journey steps
  journeyStep1: 'journey-step1_abapvl',
  journeyStep2: 'journey-step2_zp5ka7',
  journeyStep3: 'journey-step3_cng6d0',

  // Other assets
  injections: 'injections_drxohs',
  footerLogo: 'footer_logo_w8autg',
  vidacureLogo: 'vidacure_png_ddekoo',
  bankId: 'bankId_tih7am',
  frame: 'Frame_bhmjde',
  notFound: '404_jrvrqh',

  // Misc images
  image3: 'image3_mid2ho',
} as const;

export type CloudinaryImageKey = keyof typeof CloudinaryImages;
