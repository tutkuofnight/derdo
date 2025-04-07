export default async function ProfileImageResizer(image: string){
  let imageUrl = image
  if (image && image.includes('googleusercontent.com')) {
    // Farklı url formatlarını kontrol edin
    if (image.includes('=s')) {
      imageUrl = image.replace(/=s\d+-c/, '=s500-c');
    } else if (image.includes('=w')) {
      imageUrl = image.replace(/=w\d+-h\d+/, '=w500-h500');
    } else {
      imageUrl = `${image}${image.includes('?') ? '&' : '?'}sz=500`;
    }
  }
  return imageUrl
}