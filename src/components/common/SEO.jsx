import React, { useEffect } from 'react';

export const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    document.title = `${title} | SMAN 2 Koto Kampar Hulu`;

    const setMeta = (name, content) => {
        let element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content || "");
    };

    const setOgMeta = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content || "");
    };

    setMeta('description', description || "Website Resmi SMAN 2 Koto Kampar Hulu");
    setMeta('keywords', keywords || "SMAN 2 Koto Kampar Hulu, Sekolah, Riau, Pendidikan");
    setMeta('author', 'SMAN 2 Koto Kampar Hulu');
    
    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:image', image || "https://cdn-icons-png.flaticon.com/512/3281/3281329.png");
    setOgMeta('og:url', url || window.location.href);

  }, [title, description, keywords, image, url]);

  return null;
};

export const SchemaOrg = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "SMAN 2 Koto Kampar Hulu",
        "url": "https://sman2ktkh-snowy.vercel.app/", 
        "logo": "https://cdn-icons-png.flaticon.com/512/3281/3281329.png",
        "description": "Sekolah Menengah Atas Negeri berprestasi di Riau.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Pendidikan No. 1",
            "addressLocality": "Koto Kampar Hulu",
            "addressRegion": "Riau",
            "postalCode": "28453",
            "addressCountry": "ID"
        }
    };

    return (
        <script type="application/ld+json">
            {JSON.stringify(schema)}
        </script>
    );
};