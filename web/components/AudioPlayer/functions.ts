"use client"
import { VolumeStorage } from "@/types"

export const getVolume = (): VolumeStorage => {
  try {
    const storedVolume = localStorage.getItem("vol");
    if (!storedVolume) {
      // Eğer localStorage'da değer yoksa, varsayılan değer döndür
      return { prev: 0, current: 0.5 }; // Varsayılan olarak 0.5 değerini önerdim
    }
    const volume: VolumeStorage = JSON.parse(storedVolume);
    // Eksik değerler olabilir, kontrol edelim
    return {
      prev: typeof volume.prev === 'number' ? volume.prev : 0,
      current: typeof volume.current === 'number' ? volume.current : 0.5
    };
  } catch (error) {
    console.error("Volume değeri alınırken hata oluştu:", error);
    // Hata durumunda varsayılan değer döndür
    return { prev: 0, current: 0.5 };
  }
}

export const setVolume = (volumeState: VolumeStorage) => {
  try {
    // Geçersiz değerleri kontrol et
    const safeVolumeState = {
      prev: typeof volumeState.prev === 'number' ? volumeState.prev : 0,
      current: typeof volumeState.current === 'number' ? volumeState.current : 0
    };
    
    localStorage.setItem("vol", JSON.stringify(safeVolumeState));
  } catch (error) {
    console.error("Volume değeri kaydedilirken hata oluştu:", error);
  }
}