import React from "react";
import {Link} from "react-router-dom";
// import Card from "../../components/common/Card.jsx";
import PlaceHolderImage from "../../assets/placeholder.jpg";
import './ItemCard.css';

const ItemCard = ({item}) => {
    const id = item?.id;
    const name = item?.name || 'Nama Tidak Tersedia';
    const description = item?.description || 'Deskripsi tidak tersedia.';
    const images = item?.media || [];
    const BACKEND_URL = 'https://server.welazure.dev';
    const primaryImage = images.find(img => img.isPrimary) || images[0];
    const imagePath = primaryImage?.filePath;
    const imageUrl = imagePath ? (BACKEND_URL + imagePath) : PlaceHolderImage;
    console.log(imageUrl,'imageUrl');

    // Jika item tidak punya ID, kita tidak bisa menampilkannya.
    // Ini mencegah error "key" dan "link"
    if (!id) {
        return null; // Jangan render apa-apa
    }

    return (
        // <Card className="itemCard">
        <div className="item-card">
            <Link to={`/item/${item.id}`} className="card-link">

                {/* This image part has NO padding, which is what we want */}
                <div className="card-image-container">
                    <img src={imageUrl} alt={item.name} className="card-image"/>
                </div>

                {/* This content part adds its OWN padding */}
                <div className="card-content">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-description">
                        {description.length > 100
                            ? `${description.substring(0, 100)}...`
                            : description}
                    </p>
                    <span className="card-view-details">View Details</span>
                </div>
            </Link>
        {/*</Card>*/}
        </div>
    );

};
export default ItemCard;