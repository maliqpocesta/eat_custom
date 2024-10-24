<template>
  <div ref="cmaps" class="bg-grey-1" :class="class_map"></div>
  <div
    class="absolute-bottom-right"
    :class="{ 'q-ma-md': !this.$q.screen.lt.md, 'q-ma-sm': this.$q.screen.lt.md }"
    style="z-index: 99"
  >
    <div
      class="column"
      :class="{
        'q-gutter-y-md': !this.$q.screen.lt.md,
        'q-gutter-y-sm': this.$q.screen.lt.md,
      }"
    >
      <div class="col">
        <q-btn unelevated color="warning" icon="add" dense @click="setPlusZoom" />
      </div>
      <div class="col">
        <q-btn unelevated color="warning" icon="remove" dense @click="setLessZoom" />
      </div>
    </div>
  </div>
</template>

<script>
import { loadScript, unloadScript } from "vue-plugin-load-script";

const cmapsMarker = [];
let bounds = [];
let track_bounds;

export default {
  name: "Maps",
  props: [
    "keys",
    "lat",
    "lng",
    "provider",
    "zoom",
    "marker",
    "detect_location",
    "class_map",
  ],
  data() {
    return {
      cmaps: undefined,
      data: [],
      loading: false,
    };
  },
  mounted() {
    this.loadMap();
  },
  watch: {
    // lat (newval, oldval) {
    //    this.updateMarker(this.marker[0].id, this.lat, this.lng)
    // },
    marker(newval, oldval) {
      this.renderMap();
    },
    provider(newval, oldval) {
      this.loadMap();
    },
  },
  methods: {
    loadMap() {
      try {
        switch (this.provider) {
          case "google.maps":
            loadScript(
              "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=" +
                this.keys
            )
              .then(() => {
                this.renderMap();
              })
              .catch(() => {
                console.debug("failed loading map script");
              });
            // }
            break;
          case "mapbox":
            loadScript("https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.js")
              .then(() => {
                this.renderMap();
              })
              .catch(() => {
                console.debug("failed loading map script");
              });
            break;
          default:
            console.debug("no provider");
            break;
        }
      } catch (err) {
        console.error(err);
      }
    },
    renderMap() {
      try {
        switch (this.provider) {
          case "google.maps":
            bounds = new window.google.maps.LatLngBounds();
            if (typeof this.cmaps !== "undefined" && this.cmaps !== null) {
              Object.entries(this.marker).forEach(([key, items]) => {
                this.removeMarker(items.id);
              });
            } else {
              this.cmaps = new window.google.maps.Map(this.$refs.cmaps, {
                center: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) },
                zoom: parseInt(this.zoom),
                disableDefaultUI: true,
              });
            }

            Object.entries(this.marker).forEach(([key, items]) => {
              this.addMarker(
                {
                  position: { lat: parseFloat(items.lat), lng: parseFloat(items.lng) },
                  map: this.cmaps,
                  animation: window.google.maps.Animation.DROP,
                  draggable: items.draggable,
                  icon: items.icon,
                },
                items.id,
                items.draggable
              );
            });

            if (Object.keys(this.marker).length > 1) {
              this.FitBounds();
            } else {
              this.setCenter(this.marker[0].lat, this.marker[0].lng);
            }

            break;

          case "mapbox":
            mapboxgl.accessToken = this.keys;
            bounds = new mapboxgl.LngLatBounds();
            this.cmaps = new mapboxgl.Map({
              container: this.$refs.cmaps,
              style: "mapbox://styles/mapbox/streets-v12",
              center: [parseFloat(this.lng), parseFloat(this.lat)],
              zoom: 14,
            });
            Object.entries(this.marker).forEach(([key, items]) => {
              this.addMarker(
                {
                  position: { lat: parseFloat(items.lat), lng: parseFloat(items.lng) },
                  map: this.cmaps,
                  animation: null,
                  draggable: items.draggable,
                  icon: items.icon,
                },
                items.id,
                items.draggable
              );
            });

            if (Object.keys(this.marker).length > 1) {
              this.FitBounds();
            } else {
              this.setCenter(this.marker[0].lat, this.marker[0].lng);
            }
            break;
        }
      } catch (err) {
        // console.error(err)
      }
    },
    addMarker(properties, index, draggable) {
      try {
        switch (this.provider) {
          case "google.maps":
            cmapsMarker[index] = new window.google.maps.Marker(properties);
            this.cmaps.panTo(
              new window.google.maps.LatLng(
                properties.position.lat,
                properties.position.lng
              )
            );
            bounds.extend(cmapsMarker[index].position);

            if (draggable === true) {
              window.google.maps.event.addListener(
                cmapsMarker[index],
                "drag",
                (marker) => {
                  this.$emit("dragMarker", true);
                }
              );

              window.google.maps.event.addListener(
                cmapsMarker[index],
                "dragend",
                (marker) => {
                  const latLng = marker.latLng;
                  this.$emit("afterSelectmap", latLng.lat(), latLng.lng());
                }
              );

              window.google.maps.event.addListener(this.cmaps, "drag", (data) => {
                let new_position = new google.maps.LatLng(
                  this.cmaps.getCenter().lat(),
                  this.cmaps.getCenter().lng()
                );
                cmapsMarker[index].setPosition(new_position);
              });

              google.maps.event.addListener(this.cmaps, "dragend", (data) => {
                let wrapped = new google.maps.LatLng(
                  this.cmaps.getCenter().lat(),
                  this.cmaps.getCenter().lng()
                );
                this.$emit("afterSelectmap", wrapped.lat(), wrapped.lng());
              });
            }
            break;

          case "mapbox":
            cmapsMarker[index] = new mapboxgl.Marker(properties)
              .setLngLat([properties.position.lng, properties.position.lat])
              .addTo(this.cmaps);

            bounds.extend(
              new mapboxgl.LngLat(properties.position.lng, properties.position.lat)
            );

            if (draggable === true) {
              cmapsMarker[index].on("dragend", (event) => {
                const lngLat = cmapsMarker[index].getLngLat();
                this.$emit("afterSelectmap", lngLat.lat, lngLat.lng);
              });

              this.cmaps.on("drag", () => {
                cmapsMarker[index].setLngLat([
                  this.cmaps.getCenter().lng.toFixed(4),
                  this.cmaps.getCenter().lat.toFixed(4),
                ]);
              });

              this.cmaps.on("dragend", () => {
                cmapsMarker[index].setLngLat([
                  this.cmaps.getCenter().lng.toFixed(4),
                  this.cmaps.getCenter().lat.toFixed(4),
                ]);
                this.$emit(
                  "afterSelectmap",
                  this.cmaps.getCenter().lat.toFixed(4),
                  this.cmaps.getCenter().lng.toFixed(4)
                );
              });
            }
            this.mapBoxResize();
            break;
        }
      } catch (err) {
        console.error(err);
      }
    },
    mapBoxResize() {
      if (this.provider == "mapbox") {
        setTimeout(() => {
          this.cmaps.resize();
        }, 800);
      }
    },
    updateMarker(index, lat, lng) {
      try {
        setTimeout(() => {
          const latlng = new window.google.maps.LatLng(lat, lng);
          if (typeof cmapsMarker[index] !== "undefined" && cmapsMarker[index] !== null) {
            cmapsMarker[index].setPosition(latlng);
            this.cmaps.panTo(latlng);
          }
        }, 10);
      } catch (err) {
        console.error(err);
      }
    },
    removeMarker(index) {
      try {
        switch (this.provider) {
          case "google.maps":
            if (
              typeof cmapsMarker[index] !== "undefined" &&
              cmapsMarker[index] !== null
            ) {
              cmapsMarker[index].setMap(null);
              cmapsMarker.splice(index, 1);
            }
            break;
        }
      } catch (err) {
        console.error(err);
      }
    },
    setCenter(lat, lng) {
      try {
        switch (this.provider) {
          case "google.maps":
            this.cmaps.setCenter(new window.google.maps.LatLng(lat, lng));
            break;
          case "mapbox":
            this.cmaps.flyTo({
              center: [lng, lat],
              essential: true,
            });
            break;
        }
      } catch (err) {
        console.error(err);
      }
    },
    FitBounds() {
      try {
        switch (this.provider) {
          case "google.maps":
            this.cmaps.fitBounds(bounds);
            break;
          case "mapbox":
            this.cmaps.fitBounds(bounds, { duration: 0, padding: 50 });
            break;
        }
      } catch (err) {
        console.error(err);
      }
    },
    setPlusZoom() {
      this.cmaps.setZoom(this.cmaps.getZoom() + 2);
    },
    setLessZoom() {
      this.cmaps.setZoom(this.cmaps.getZoom() - 2);
    },
  },
};
</script>
