<template>
  <div class="svgLogo" v-on:click="color" v-html="svg">
  </div>
</template>


<script>

export default {
  methods: {
    color (event) {
      console.debug(event.srcElement.style.fill)
      let color = event.srcElement.style.fill
      color = (color.substring(0, 3) + 'a' + color.substring(3))
      color = color.substring(0, color.length - 1) + ', 0.3)'
      document.getElementsByTagName('body')[0].style.backgroundColor = color
    }
  },
  data () {
    return {
      svg: `<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   viewBox="0 0 744.09448819 1052.3622047"
   id="svg3535"
   version="1.1"
   inkscape:version="0.91 r13725"
   style="position:absolute; left:0; top:0; width:100%; height:90%"
   sodipodi:docname="afeefa_light_withoutLink.svg">
  <defs
     id="defs3537" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="0.35"
     inkscape:cx="375"
     inkscape:cy="520"
     inkscape:document-units="px"
     inkscape:current-layer="layer1"
     showgrid="false"
     inkscape:window-width="1366"
     inkscape:window-height="692"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="1" />
  <metadata
     id="metadata3540">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <g
       id="g29"
       transform="matrix(3.1862702,0,0,3.1862702,10.507143,28.07649)">
      <polygon
         points="0,73.4 0,154.6 8.6,208 "
         id="polygon31"
         style="fill:#966c6c" />
      <polygon
         points="8,118.5 0,154.6 0,73.4 27,16.7 "
         id="polygon33"
         style="fill:#360a21" />
      <polygon
         points="228.7,106.9 211.8,154.6 203.2,208 "
         id="polygon35"
         style="fill:#1a1515" />
      <polygon
         points="53.1,184.1 77.1,179.8 88.9,179.8 69.3,266.2 30.7,172.4 34.8,176.5 40.6,181.8 "
         id="polygon37"
         style="fill:#f4e7a8" />
      <polygon
         points="8,118.5 0,154.6 105.9,50.1 33.9,66.3 "
         id="polygon39"
         style="fill:#cc8692" />
      <polygon
         points="40.6,181.8 53.1,184.1 77.1,179.8 66,170.5 47.9,168.5 34.8,176.5 "
         id="polygon41"
         style="fill:#ffffff" />
      <path
         d="m 63.9,173.7 c 0,4.7 -3.8,8.4 -8.4,8.4 -4.7,0 -8.4,-3.8 -8.4,-8.4 0,-4.7 3.8,-8.4 8.4,-8.4 4.6,0 8.4,3.7 8.4,8.4"
         id="path43"
         inkscape:connector-curvature="0"
         style="fill:#a0a77a" />
      <path
         d="m 58.9,172.8 c 0,1.8 -1.4,3.2 -3.2,3.2 -1.8,0 -3.2,-1.4 -3.2,-3.2 0,-1.8 1.4,-3.2 3.2,-3.2 1.8,0.1 3.2,1.5 3.2,3.2"
         id="path45"
         inkscape:connector-curvature="0" />
      <path
         d="m 57.4,172.7 c 0,0.5 -0.4,0.9 -0.9,0.9 -0.5,0 -0.9,-0.4 -0.9,-0.9 0,-0.5 0.4,-0.9 0.9,-0.9 0.5,0 0.9,0.4 0.9,0.9"
         id="path47"
         inkscape:connector-curvature="0"
         style="fill:#ffffff" />
      <polygon
         points="77.1,179.8 66,170.5 66.9,164.8 "
         id="polygon49"
         style="fill:#4c3f05" />
      <polygon
         points="45.5,161.1 66.9,164.8 66,170.5 47.9,168.5 "
         id="polygon51"
         style="fill:#39310a" />
      <polygon
         points="0,154.6 105.9,50.1 105.9,163.8 79.2,152.8 36.3,145.3 "
         id="polygon53"
         style="fill:#ddaeb7" />
      <polygon
         points="39,138.1 16.7,150.3 36.3,145.3 79.2,152.8 74.7,142.1 "
         id="polygon55"
         style="fill:#261f20" />
      <polygon
         points="53.1,184.1 40.6,181.8 34.8,176.5 39.7,182.4 53.4,185.1 77.1,179.8 "
         id="polygon57"
         style="fill:#4e3f42" />
      <polygon
         points="66,170.5 47.9,168.5 34.8,176.5 47.9,169 66,170.7 77.1,179.8 "
         id="polygon59" />
      <polygon
         points="89.3,318.5 69.3,266.2 24.1,263.2 47.9,290.6 "
         id="polygon61"
         style="fill:#de8138" />
      <polygon
         points="8.6,208 30.7,172.4 0,154.6 "
         id="polygon63"
         style="fill:#e4c326" />
      <polygon
         points="8.6,208 33.4,252.1 69.3,266.2 24.1,263.2 "
         id="polygon65"
         style="fill:#e59a60" />
      <polygon
         points="69.3,266.2 89.3,318.5 105.9,320 105.9,291.3 88.5,290 "
         id="polygon67"
         style="fill:#ebb388" />
      <polygon
         points="33.4,252.1 8.6,208 30.7,172.4 69.3,266.2 "
         id="polygon69"
         style="fill:#e9cf51" />
      <polygon
         points="87.4,239.6 76.5,234.7 105.9,239.6 "
         id="polygon71"
         style="fill:#925550" />
      <polygon
         points="69.3,266.2 76.5,234.7 87.4,239.6 97.7,252.2 "
         id="polygon73"
         style="fill:#efdb7d" />
      <polygon
         points="105.9,255.1 97.7,252.2 105.9,239.6 "
         id="polygon75"
         style="fill:#cdcbb2" />
      <polygon
         points="87.4,239.6 105.9,239.6 97.7,252.2 "
         id="polygon77"
         style="fill:#ada753" />
      <polygon
         points="94.1,217.7 105.9,224.4 105.9,163.8 "
         id="polygon79"
         style="fill:#dedcba" />
      <polygon
         points="89.3,283.1 69.3,266.2 88.5,290 105.9,291.3 105.9,283.3 "
         id="polygon81"
         style="fill:#d8afac" />
      <polygon
         points="105.9,271.2 69.3,266.2 105.9,283.3 "
         id="polygon83"
         style="fill:#9e3830" />
      <polygon
         points="69.3,266.2 89.3,283.1 105.9,283.3 "
         id="polygon85"
         style="fill:#ecd7d6" />
      <polygon
         points="105.9,263.1 105.9,255.1 97.7,252.2 69.3,266.2 94.1,261.7 "
         id="polygon87"
         style="fill:#ecd7d6" />
      <polygon
         points="94.1,261.7 105.9,263.1 105.9,267.5 69.3,266.2 "
         id="polygon89"
         style="fill:#772a24" />
      <polygon
         points="69.3,266.2 105.9,271.2 105.9,267.5 "
         id="polygon91"
         style="fill:#4f1c18" />
      <polygon
         points="0,154.6 30.7,172.4 36.3,145.3 "
         id="polygon93"
         style="fill:#ab921d" />
      <polygon
         points="45.5,161.1 36.3,145.3 30.7,172.4 "
         id="polygon95"
         style="fill:#e4c326" />
      <polygon
         points="79.2,152.8 36.3,145.3 45.5,161.1 66.9,164.8 "
         id="polygon97"
         style="fill:#e9cf51" />
      <polygon
         points="94.1,217.7 76.5,234.7 88.9,179.8 "
         id="polygon99"
         style="fill:#827d3e" />
      <polygon
         points="105.9,163.8 94.1,217.7 88.9,179.8 "
         id="polygon101"
         style="fill:#ceca98" />
      <polygon
         points="79.2,152.8 88.9,179.8 105.9,163.8 "
         id="polygon103"
         style="fill:#d69ea8" />
      <polygon
         points="79.2,152.8 66.9,164.8 77.1,179.8 88.9,179.8 "
         id="polygon105"
         style="fill:#efdb7d" />
      <polygon
         points="30.7,172.4 34.8,176.5 47.9,168.5 45.5,161.1 "
         id="polygon107"
         style="fill:#726213" />
      <polygon
         points="96,232 87.4,236.4 105.9,239.6 "
         id="polygon109"
         style="fill:#8e7746" />
      <polygon
         points="105.9,239.6 105.9,224.4 94.1,217.7 96,232 "
         id="polygon111"
         style="fill:#c0bea8" />
      <polygon
         points="87.4,236.4 76.5,234.7 94.1,217.7 96,232 "
         id="polygon113"
         style="fill:#bdb975" />
      <polygon
         points="27,16.7 105.9,0 105.9,50.1 33.9,66.3 "
         id="polygon115"
         style="fill:#733b7c" />
      <polygon
         points="8,118.5 33.9,66.3 27,16.7 "
         id="polygon117"
         style="fill:#492144" />
      <polygon
         points="158.8,184.1 134.7,179.8 123,179.8 142.5,266.2 181.2,172.4 177,176.5 171.2,181.8 "
         id="polygon119"
         style="fill:#d5e8e9" />
      <polygon
         points="203.8,118.5 211.8,154.6 105.9,50.1 177.9,66.3 "
         id="polygon121"
         style="fill:#d8afac" />
      <polygon
         points="171.2,181.8 158.8,184.1 134.7,179.8 145.8,170.5 163.9,168.5 177,176.5 "
         id="polygon123"
         style="fill:#ffffff" />
      <path
         d="m 147.9,173.7 c 0,4.7 3.8,8.4 8.4,8.4 4.7,0 8.4,-3.8 8.4,-8.4 0,-4.7 -3.8,-8.4 -8.4,-8.4 -4.6,-0.1 -8.4,3.7 -8.4,8.4"
         id="path125"
         inkscape:connector-curvature="0"
         style="fill:#5b6a69" />
      <path
         d="m 152.9,172.8 c 0,1.8 1.4,3.2 3.2,3.2 1.8,0 3.2,-1.4 3.2,-3.2 0,-1.8 -1.4,-3.2 -3.2,-3.2 -1.8,0.1 -3.2,1.5 -3.2,3.2"
         id="path127"
         inkscape:connector-curvature="0" />
      <path
         d="m 154.4,172.7 c 0,0.5 0.4,0.9 0.9,0.9 0.5,0 0.9,-0.4 0.9,-0.9 0,-0.5 -0.4,-0.9 -0.9,-0.9 -0.5,0 -0.9,0.4 -0.9,0.9"
         id="path129"
         inkscape:connector-curvature="0"
         style="fill:#ffffff" />
      <polygon
         points="134.7,179.8 145.8,170.5 144.9,164.8 "
         id="polygon131"
         style="fill:#103637" />
      <polygon
         points="166.3,161.1 144.9,164.8 145.8,170.5 163.9,168.5 "
         id="polygon133"
         style="fill:#185053" />
      <polygon
         points="211.8,154.6 105.9,50.1 105.9,163.8 132.7,152.8 175.5,145.3 "
         id="polygon135"
         style="fill:#ecd7d6" />
      <polygon
         points="172.8,138.1 195.1,150.3 175.5,145.3 132.7,152.8 137.1,142.1 "
         id="polygon137"
         style="fill:#301e1f" />
      <polygon
         points="158.8,184.1 171.2,181.8 177,176.5 172.1,182.4 158.5,185.1 134.7,179.8 "
         id="polygon139"
         style="fill:#4e3f42" />
      <polygon
         points="145.8,170.5 163.9,168.5 177,176.5 163.9,169 145.8,170.7 134.7,179.8 "
         id="polygon141" />
      <polygon
         points="122.6,318.5 142.5,266.2 187.7,263.2 163.9,290.6 "
         id="polygon143"
         style="fill:#5779a1" />
      <polygon
         points="203.2,208 181.2,172.4 211.8,154.6 "
         id="polygon145"
         style="fill:#206b6e" />
      <polygon
         points="203.2,208 178.4,252.1 142.5,266.2 187.7,263.2 "
         id="polygon147"
         style="fill:#819ab9" />
      <polygon
         points="142.5,266.2 122.6,318.5 105.9,320 105.9,291.3 123.3,290 "
         id="polygon149"
         style="fill:#abbcd0" />
      <polygon
         points="178.4,252.1 203.2,208 181.2,172.4 142.5,266.2 "
         id="polygon151"
         style="fill:#aad2d4" />
      <polygon
         points="124.4,239.6 135.4,234.7 105.9,239.6 "
         id="polygon153"
         style="fill:#c57570" />
      <polygon
         points="142.5,266.2 135.4,234.7 124.4,239.6 114.1,252.2 "
         id="polygon155"
         style="fill:#bbdbdd" />
      <polygon
         points="105.9,255.1 114.1,252.2 105.9,239.6 "
         id="polygon157"
         style="fill:#d2e1e2" />
      <polygon
         points="124.4,239.6 105.9,239.6 114.1,252.2 "
         id="polygon159"
         style="fill:#ddedee" />
      <polygon
         points="117.7,217.7 105.9,224.4 105.9,163.8 "
         id="polygon161"
         style="fill:#d2e1e2" />
      <polygon
         points="122.6,283.1 142.5,266.2 123.3,290 105.9,291.3 105.9,283.3 "
         id="polygon163"
         style="fill:#baa2a0" />
      <polygon
         points="105.9,271.2 142.5,266.2 105.9,283.3 "
         id="polygon165"
         style="fill:#744440" />
      <polygon
         points="142.5,266.2 122.6,283.1 105.9,283.3 "
         id="polygon167"
         style="fill:#dcd0cf" />
      <polygon
         points="105.9,263.1 105.9,255.1 114.1,252.2 142.5,266.2 117.7,261.7 "
         id="polygon169"
         style="fill:#baa2a0" />
      <polygon
         points="117.7,261.7 105.9,263.1 105.9,267.5 142.5,266.2 "
         id="polygon171"
         style="fill:#521511" />
      <polygon
         points="142.5,266.2 105.9,271.2 105.9,267.5 "
         id="polygon173"
         style="fill:#3d100c" />
      <polygon
         points="211.8,154.6 181.2,172.4 175.5,145.3 "
         id="polygon175"
         style="fill:#2b8e93" />
      <polygon
         points="166.3,161.1 175.5,145.3 181.2,172.4 "
         id="polygon177"
         style="fill:#80bbbe" />
      <polygon
         points="132.7,152.8 175.5,145.3 166.3,161.1 144.9,164.8 "
         id="polygon179"
         style="fill:#aad2d4" />
      <polygon
         points="117.7,217.7 135.4,234.7 123,179.8 "
         id="polygon181"
         style="fill:#9ccad6" />
      <polygon
         points="105.9,163.8 117.7,217.7 123,179.8 "
         id="polygon183"
         style="fill:#d3f0f1" />
      <polygon
         points="132.7,152.8 123,179.8 105.9,163.8 "
         id="polygon185"
         style="fill:#cfdada" />
      <polygon
         points="132.7,152.8 144.9,164.8 134.7,179.8 123,179.8 "
         id="polygon187"
         style="fill:#d5e8e9" />
      <polygon
         points="181.2,172.4 177,176.5 163.9,168.5 166.3,161.1 "
         id="polygon189"
         style="fill:#79a6a8" />
      <polygon
         points="115.8,232 124.4,236.4 105.9,239.6 "
         id="polygon191"
         style="fill:#468e8c" />
      <polygon
         points="105.9,239.6 105.9,224.4 117.7,217.7 115.8,232 "
         id="polygon193"
         style="fill:#a6c4c5" />
      <polygon
         points="124.4,236.4 135.4,234.7 117.7,217.7 115.8,232 "
         id="polygon195"
         style="fill:#a6c4c5" />
      <polygon
         points="184.8,16.7 105.9,0 105.9,50.1 177.9,66.3 "
         id="polygon197"
         style="fill:#c07fbd" />
      <polygon
         points="203.8,118.5 177.9,66.3 184.8,16.7 "
         id="polygon199"
         style="fill:#9e3830" />
      <polygon
         points="203.8,118.5 211.8,154.6 228.7,106.9 184.8,16.7 "
         id="polygon201"
         style="fill:#692620" />
    </g>
  </g>
</svg>`
    }
  }
}
</script>

<style lang="scss" scoped>
.svgLogo {
  position: relative;
  height: 100%;
}
</style>
