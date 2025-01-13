export default function(duration: number): [number, number] {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return [minutes, seconds]
}