import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: iconShadow
})
