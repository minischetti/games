export function Art({ state, stateUpdate }) {
    const art = state.context.art;
    const isImage = (artwork) => artwork.image?.src;
    const getImage = (artwork) => artwork.image?.src;
    const isColor = (artwork) => artwork.color.r && artwork.color.g && artwork.color.b;
    const getColor = (artwork) => `rgb(${artwork.color.r}, ${artwork.color.g}, ${artwork.color.b})`;
    console.log(art);
    return (
        <div>
            <h2>Art</h2>
            <div className="artwork-list">
                {art.map((artwork, index) => (
                    <div key={index} className="artwork">
                        <div>
                            {isImage(artwork) && <img className="artwork-image" src={getImage(artwork)} alt={artwork.name} />}
                            {isColor(artwork) &&
                                <div className="artwork-color" style={{ backgroundColor: getColor(artwork) }} />
                            }
                        </div>
                        <div className="artwork-name">{artwork.name}</div>
                        {/* <div className="artwork-artist">{artwork.artist}</div> */}
                        {/* <div className="artwork-year">{artwork.year}</div> */}
                        {/* <div className="artwork-value">{artwork.value}</div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}