@extends ('layouts.container')

@section ('view-class', 'connectivity-matrix-explanations')

@section ('content')

<header>
    <h1>Explicaciones de los métodos de cañoneo</h1>
</header>

<main>
    <p>
        Aquí podrá consultar una breve explicación de cada uno de los métodos de cañoneo recomendados por la matriz.
    </p>
    <h2 id="gun">
        <a href="#gun">Cañón bajado a través del revestidor (Casing Gun)</a>
    </h2>
    <p>
        En esta técnica se realiza el cañoneo a través del Casing sin necesidad de tubería de producción. El diámetro interno del casing limita el tamaño del cañón, esto permite usar mayor rendimiento de penetración profunda o cargas de hueco grande para una densidad de tiro optima y fases de perforación.  Una de las ventajas es que proporciona control sobre el tamaño de las perforaciones. En la <strong>Figura 1</strong> se observa la representación de la técnica.
    </p>
    <p>
        <strong>Figura 1.</strong> Técnica Casing Gun.
    </p>
    <div class="img"><img src="/images/casing-gun.png" /></div>
    <p>
        <strong>Fuente.</strong> COSAD, Charlie. Schlumberger Testing Services. Oilfield Riview. Aberdeen, Escocia. 1992.
    </p>
    <h2 id="thru">
        <a href="#thru">Cañón bajado a través de tubería de producción (Through Tubing)</a>
    </h2>
    <p>
        Se realiza cuando se ha finalizado el completamiento, se crea un diferencial de presión negativo y posteriormente se baja el cañón con equipo de guaya. Este método de cañoneo (Ver <strong>Figura 2</strong>) permite obtener una buena limpieza de las perforaciones debido a su condición de presión. Sin embargo, ellos no son selectivos, es por ello que cuando se requiere probar otro intervalo es necesario controlar el pozo pues las perforaciones quedan expuestas a los fluidos de control, lo que puede causar daño.

    </p>
    <p>
        <strong>Figura 2.</strong> Técnica de cañoneo through tubing.
    </p>
    <div class="img"><img src="/images/thru.png" /></div>
    <p>
        <strong>Fuente.</strong> COSAD, Charlie. Schlumberger Testing Services. Oilfield Riview. Aberdeen, Escocia. 1992.
    </p>
    <h2 id="tcp">
        <a href="#tcp">Cañón con TCP (Tubing Conveyed Perforating)</a>
    </h2>
    <p>
        Esta técnica (Ver <strong>Figura 3</strong>) involucra la corrida de un cañón casing estándar con tubing o tubería de perforación. Las operaciones de TCP son más eficientes pues brindan perforación de múltiples intervalos, es decir que si se requiere con ayuda de una empacadura se logra perforar en una corrida gran extensión de intervalos. Sin embargo, otras técnicas como el Wireline proporciona mayor velocidad de perforación; éste factor es importante tenerlo en cuenta cuando se analiza la operación a llevar a cabo en pozos con altas temperaturas, ya que su velocidad hace que el tiempo de exposición de los explosivos sea menor. Por otra parte, brinda grandes beneficios en cuanto a la seguridad operacional pues de tiene tubería en el pozo al igual que tener instalado el cabezal del pozo. Mediante este sistema, el cañón tiene dos maneras de ser disparado<sup>1</sup>: Por diferencial de presión y por percusión.
    </p>
    <p>
        <strong>Figura 3.</strong> Cañoneo Tubing Conveyed Perforating.
    </p>
    <div class="img"><img src="/images/tcp.png" /></div>
    <p>
        <strong>Fuente.</strong> COSAD, Charlie. Schlumberger Testing Services. Oilfield Riview. Aberdeen, Escocia. 1992.
    </p>
    <hr>
      <ol>
          <li>MENDOZA PASTO, Bertha Sol Ángel. “Análisis mecánico y de riesgos para la implementación de la técnica de estimulación fracturamiento con gas a alta energía (HEGF) en pozos colombianos”, Colombia. Universidad Industrial de Santander; Facultad de Ingenierías físico-químicas, 2012.  29 p.</li>
      </ol>
</main>

@endsection
