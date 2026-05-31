import { useNavigate } from "react-router-dom";

export default function BrandSlider() {
  const navigate = useNavigate();

  const logos = [
    { src: "/brands/zara.jpg",   brand: "zara"   },
    { src: "/brands/hm.png",     brand: "hm"     },
    { src: "/brands/nike.jpg",   brand: "nike"   },
    { src: "/brands/adidas.jpg", brand: "adidas" },
    { src: "/brands/polo.jpg",   brand: "polo"   },
    { src: "/brands/levis.jpg",  brand: "levis"  },
    { src: "/brands/lv.jpg",     brand: "lv"     },
    { src: "/brands/gucci.jpg",  brand: "gucci"  },
  ];

  return (
    <div className="overflow-hidden bg-white py-6 mt-12">
      <div className="slider-track">
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="logo-item cursor-pointer"
            onClick={() => navigate(`/brand/${logo.brand}`)}
          >
            <img src={logo.src} />
          </div>
        ))}
      </div>
    </div>
  );
}