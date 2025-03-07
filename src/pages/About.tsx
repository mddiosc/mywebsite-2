const About = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold">Sobre Mí</h1>
      <div className="about-content max-w-4xl">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold">Biografía</h2>
          <p className="mt-4 text-lg text-gray-500">
            {/* Aquí puedes agregar tu biografía */}
            Soy un desarrollador apasionado con experiencia en diversas tecnologías...
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold">Habilidades</h2>
          <ul className="mt-4 list-inside list-disc text-lg text-gray-500">
            {/* Aquí puedes agregar tus habilidades */}
            <li>JavaScript</li>
            <li>React</li>
            <li>Node.js</li>
            <li>...otras habilidades...</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold">Proyectos</h2>
          <p className="mt-4 text-lg text-gray-500">
            {/* Aquí puedes agregar una descripción de tus proyectos */}
            He trabajado en varios proyectos interesantes, incluyendo...
          </p>
        </section>
        <section>
          <h2 className="text-3xl font-semibold">Contacto</h2>
          <p className="mt-4 text-lg text-gray-500">
            {/* Aquí puedes agregar tu información de contacto */}
            Puedes contactarme a través de mi correo electrónico: ejemplo@correo.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
