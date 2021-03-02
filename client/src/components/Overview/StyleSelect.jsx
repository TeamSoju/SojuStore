import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductInfo from './ProductInfo.jsx';

function StyleSelect (props) {
  const [styles, setStyles] = useState([])
  const [thumbnail, setThumbnail] = useState([])
  const [defaultStyle, setDefaultStyle] = useState({})
  const [thumbClick, setThumbClick] = useState(false)
  const [defaultPhoto, setDefaultPhoto] = useState('')

  useEffect(() => {
    if (props.data !== undefined) {
      axios.get(`/api/styles/${props.data}`)
        .then((results) => setStyles(results.data.results))
        .catch((err) => console.error(err))
    }
  }, [props.data])

  useEffect(() => {
    var res = [];
    {styles.map(item => {
      if (item['default?']) {
        setDefaultStyle(item)
      }
      item.photos.map((item, index) => {
        res.push(item)
        setThumbnail(res)
        })
      })}
  }, [styles])

  useEffect(() => {
    if (Object.keys(defaultStyle).length > 0) {
      setDefaultPhoto(defaultStyle.photos[0].url)
    }
  }, [defaultStyle])

  const thumbnailModel = (array) => {
    var result = [];
    var finalRes = [];

    for (var i = 0; i < array.length; i++) {
      if (result.length === 4) {
        finalRes.push(result)
        result = [];
      } else if (i === array.length - 1) {
        result.push(array[i]);
        finalRes.push(result);
      } else {
        result.push(array[i]);
      }
    }

    return finalRes;
  }

  const clickThumbnail = (ind, newPhoto) => {
    setDefaultPhoto(newPhoto)
    var newStyle = styles[ind]
    setDefaultStyle(newStyle);
  }

  return (
    <div>
        {console.log(defaultStyle)}
        {defaultPhoto !== undefined ? <img className="defaultStyle-img" src={defaultPhoto} ></img> : null}
      {thumbnailModel(thumbnail).map((itemA, index) => (
        <div key={index}>
        {itemA.map((item, index) => (
          <img src={item.thumbnail_url} key={index} className="thumbnail-img" onClick={() => clickThumbnail(index, item.url)}></img>
        ))}
        </div>
      ))}
      {defaultStyle.sale_price === null ? <div> $ {defaultStyle.original_price} </div> : <div> ${defaultStyle.sale_price} <strike> $ {defaultStyle.original_price} </strike> </div> }
      <ProductInfo default={defaultStyle} />
    </div>
  )
}

export default StyleSelect

 // const makeButtonCSS = (thumbnail) => {
  //   return {
  //     backgroundImage: `url(${thumbnail})`,
  //   }
  // };
