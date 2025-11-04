import { useState } from "react";
// Ya no necesitamos 'jsx' de 'react/jsx-runtime'

// 1. **Definir la Interfaz (Type/Shape)** para tipar el estado 'canciones'
interface SongItem {
    data: {
        id: string; // El ID de la canción
        name: string; // El nombre de la canción
        uri: string; // La URI de Spotify (útil para generar la URL si es necesario)
        albumOfTrack: {
            // URL de la imagen del álbum
            coverArt: {
                sources: { url: string }[]; 
            };
        };
        artists: {
            items: {
                // El nombre del artista principal
                luster: { name: string };
            }[];
        };
    };
}

export default function ApiSpoti() {
    // Tipado para la cadena de búsqueda (string)
    const [cancion, setCancion] = useState<string>('');
    // Tipado para la lista de canciones (array de SongItem)
    const [canciones, setCanciones] = useState<SongItem[]>([]);

    // Tipado del parámetro 'e'
    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if(cancion.trim() === '') {
            alert('Debes ingresar algo')
            return
        }

        getSong(cancion)
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1aa4b2378fmsh7006ff51d1db356p1e54e9jsnf41576801d05',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    // Tipado del parámetro 'songQuery'
    async function getSong(songQuery: string) {
        try {
            const url = `https://spotify23.p.rapidapi.com/search/?q=${songQuery}&type=multi&offset=0&limit=5&numberOfTopResults=5` 
            const data = await fetch(url, options)
            const response = await data.json()
            setCanciones(response.tracks.items);
            setCancion(''); // Limpiamos el input después de la búsqueda exitosa
            
        } catch(err) {
            console.log(`Error: ${err}`);
        }
    }

    return (
        <>
            <h1>Buscador de Spotify (RapidAPI)</h1>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Escribe el nombre de la canción"
                    value={cancion} 
                    onChange={e => setCancion(e.target.value)} 
                />
                <button type="submit">Buscar</button>
            </form>
            
            {/* Si no hay canciones, mostramos un mensaje */}
            {canciones.length === 0 && <p>Busca una canción para empezar.</p>}

            {/* Mapeamos y mostramos la información */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                {canciones.map((item) => {
                    const { data } = item;
                    // Obtenemos el artista principal (puede haber varios)
                    const artista = data.artists.items[0]?.luster.name || 'Artista Desconocido'; 
                    // Obtenemos la URL de la imagen (la primera fuente disponible)
                    const imagenUrl = data.albumOfTrack.coverArt.sources[0]?.url;
                    // Creamos una URL de Spotify para el track a partir de la URI
                    const spotifyUrl = `https://open.spotify.com/track/${data.id}`;

                    return (
                        // Usamos el ID de la canción como key
                        <div key={data.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                            {/* IMAGEN */}
                            {imagenUrl && (
                                <img 
                                    src={imagenUrl} 
                                    alt={`Portada de ${data.name}`} 
                                    style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                                />
                            )}
                            {/* NOMBRE */}
                            <h3>{data.name}</h3>
                            {/* ARTISTA */}
                            <p><strong>Artista:</strong> {artista}</p>
                            {/* ID */}
                            <p><strong>ID:</strong> {data.id}</p>
                            {/* URL */}
                            <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
                                Ver en Spotify
                            </a>
                        </div>
                    );
                })}
            </div>
        </>
    )
}


