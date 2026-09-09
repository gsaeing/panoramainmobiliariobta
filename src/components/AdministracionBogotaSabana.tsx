import React from 'react';
import { ShieldCheck, FileText, Banknote, Wrench, MapPin, Phone } from 'lucide-react';

/**
 * Sección SEO de administración en Bogotá y Sabana.
 * Explica: texto que Google lee para mostrar a quien quiere poner en administración su inmueble.
 */
export const AdministracionBogotaSabana: React.FC = () => {
  // Explica: datos con formato Google para salir como negocio local.
  const datosGoogle = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Panorama Inmobiliario',
    url: 'https://panoramainmobiliariobta.com/',
    telephone: '+573016250244',
    email: 'panoramainmobiliario1@gmail.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Bogotá', addressCountry: 'CO' },
    areaServed: ['Bogotá', 'Chía', 'Cajicá', 'La Calera', 'Zipaquirá', 'Cota', 'Mosquera', 'Funza', 'Madrid', 'Soacha'],
    openingHours: 'Mo-Fr 08:00-18:00',
    priceRange: '$$',
  };

  // Explica: lista de servicios que ofrecemos al administrar.
  const servicios = [
    { icono: ShieldCheck, titulo: 'Estudio del arrendatario', texto: 'Verificamos identidad, ingresos, referencias y antecedentes antes de firmar cualquier contrato.' },
    { icono: FileText, titulo: 'Contrato y firma electrónica', texto: 'Contrato con validez legal, inventario de entrega y firma en línea sin desplazamientos.' },
    { icono: Banknote, titulo: 'Recaudo y giro mensual', texto: 'Cobramos el canon y le giramos cada mes. Tarifa estándar 10% más seguro de arriendo opcional.' },
    { icono: Wrench, titulo: 'Mantenimiento y respaldo jurídico', texto: 'Atendemos daños, asambleas y procesos legales por usted durante todo el arriendo.' },
  ];

  // Explica: preguntas que la gente busca en Google.
  const preguntas = [
    { p: '¿Cuánto cuesta poner mi inmueble en administración en Bogotá?', r: 'La tarifa estándar es 10% del canon mensual más un canon por colocación del inquilino. Ejemplo: con un arriendo de $2.500.000, la administración es $250.000 y usted recibe $2.250.000.' },
    { p: '¿En cuánto tiempo arriendan mi apartamento o casa?', r: 'Con precio correcto y buena promoción, entre 2 y 6 semanas según la zona y el estado. Le damos una estimación real tras la visita sin costo.' },
    { p: '¿Administran inmuebles en Chía, Cajicá y La Calera?', r: 'Sí. Cubrimos toda la Sabana: Chía, Cajicá, La Calera, Zipaquirá, Cota, Tocancipá, Mosquera, Funza, Madrid y Soacha, además de Bogotá.' },
    { p: '¿Qué pasa si el inquilino no paga el arriendo?', r: 'Con el seguro de arriendo (desde 3,5% del canon con Sura, Bolívar o Liberty) el pago mensual está cubierto y nos encargamos del proceso jurídico.' },
    { p: '¿Qué documentos necesito para poner mi inmueble en administración?', r: 'Certificado de tradición y libertad reciente, escritura, paz y salvo de administración y servicios, e impuesto predial al día. Le ayudamos a reunirlos.' },
  ];

  return (
    <article className="space-y-8">
      {/* Datos para Google */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosGoogle) }} />

      {/* Título principal con palabras clave */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/10 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Administración de inmuebles · Bogotá y Sabana</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-50 font-['Cabinet_Grotesk',sans-serif]">
          Ponga su inmueble en administración en Bogotá y la Sabana
        </h1>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          ¿Quiere poner en administración su apartamento o casa en Bogotá, Chía, Cajicá, La Calera, Zipaquirá,
          Mosquera, Funza, Madrid o Soacha? En <strong className="text-slate-100">Panorama Inmobiliario</strong> conseguimos
          un buen inquilino, firmamos el contrato con respaldo legal, recaudamos el arriendo y le giramos cada mes.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/573016250244?text=Hola%20Panorama%2C%20quiero%20poner%20mi%20inmueble%20en%20administraci%C3%B3n%20en%20Bogot%C3%A1%20o%20Sabana"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400"
          >
            <Phone className="w-4 h-4" /> Poner mi inmueble en administración
          </a>
          <span className="inline-flex items-center justify-center text-xs text-slate-400">
            Respuesta en menos de 24 horas · Asesoría inicial sin costo
          </span>
        </div>
      </div>

      {/* Servicios */}
      <section>
        <h2 className="text-xl font-extrabold text-slate-100 font-['Cabinet_Grotesk',sans-serif]">¿Qué incluye la administración?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {servicios.map((s) => {
            const Icono = s.icono;
            return (
              <div key={s.titulo} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2">
                  <Icono className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">{s.titulo}</h3>
                </div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.texto}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Zonas */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100">Zonas donde administramos inmuebles</h2>
        </div>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Bogotá:</strong> Chicó, Usaquén, Chapinero, Cedritos, Santa Bárbara,
          Rosales, Parque 93, Suba, Colina Campestre, Niza, Salitre, Modelia.{' '}
          <strong className="text-slate-200">Sabana:</strong> Chía, Cajicá, La Calera, Zipaquirá, Cota,
          Tocancipá, Mosquera, Funza, Madrid y Soacha.
        </p>
      </section>

      {/* Preguntas frecuentes */}
      <section>
        <h2 className="text-xl font-extrabold text-slate-100 font-['Cabinet_Grotesk',sans-serif]">Preguntas frecuentes sobre administración</h2>
        <div className="mt-4 space-y-3">
          {preguntas.map((f) => (
            <div key={f.p} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-sm font-bold text-amber-300">{f.p}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{f.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-slate-300">
        <strong className="text-slate-100">Panorama Inmobiliario</strong> · Bogotá D.C. · WhatsApp{' '}
        <a className="text-amber-300 font-bold" href="https://wa.me/573016250244">301 625 0244</a> ·{' '}
        panoramainmobiliario1@gmail.com · Lun–Vie 08:00–18:00, Sáb 09:00–13:00.
      </section>
    </article>
  );
};
