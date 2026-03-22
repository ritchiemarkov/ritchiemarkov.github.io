import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/base.css'
import 'vitepress/dist/client/theme-default/styles/icons.css'
import 'vitepress/dist/client/theme-default/styles/utils.css'
import 'vitepress/dist/client/theme-default/styles/components/custom-block.css'
import 'vitepress/dist/client/theme-default/styles/components/vp-code.css'
import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css'
import 'vitepress/dist/client/theme-default/styles/components/vp-doc.css'
import 'vitepress/dist/client/theme-default/styles/components/vp-sponsor.css'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
import '@orestbida/iframemanager/dist/iframemanager.css'

import Layout from './Layout.vue'
import ContentArchivePage from './components/ContentArchivePage.vue'
import ContentSearchPage from './components/ContentSearchPage.vue'
import GalleryCollectionPage from './components/GalleryCollectionPage.vue'
import GalleryCollectionsPage from './components/GalleryCollectionsPage.vue'
import GalleryDetailPage from './components/GalleryDetailPage.vue'
import GalleryMosaic from './components/GalleryMosaic.vue'
import HomeSectionDeck from './components/HomeSectionDeck.vue'
import PhrizmGallery from './components/PhrizmGallery.vue'
import SiteSearchPage from './components/SiteSearchPage.vue'
import TravelTripIndexPage from './components/TravelTripIndexPage.vue'
import TravelTripsIndexPage from './components/TravelTripsIndexPage.vue'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './components/ui/card'
import InfoBox from './components/InfoBox.vue'
import ParallaxImage from './components/ParallaxImage.vue'
import YouTubeVideo from './components/YouTubeVideo.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('Badge', Badge)
    app.component('Button', Button)
    app.component('Card', Card)
    app.component('CardContent', CardContent)
    app.component('CardDescription', CardDescription)
    app.component('CardFooter', CardFooter)
    app.component('CardHeader', CardHeader)
    app.component('CardTitle', CardTitle)
    app.component('InfoBox', InfoBox)
    app.component('ParallaxImage', ParallaxImage)
    app.component('ContentArchivePage', ContentArchivePage)
    app.component('ContentSearchPage', ContentSearchPage)
    app.component('GalleryCollectionPage', GalleryCollectionPage)
    app.component('GalleryCollectionsPage', GalleryCollectionsPage)
    app.component('GalleryDetailPage', GalleryDetailPage)
    app.component('GalleryMosaic', GalleryMosaic)
    app.component('HomeSectionDeck', HomeSectionDeck)
    app.component('PhrizmGallery', PhrizmGallery)
    app.component('SiteSearchPage', SiteSearchPage)
    app.component('TravelTripIndexPage', TravelTripIndexPage)
    app.component('TravelTripsIndexPage', TravelTripsIndexPage)
    app.component('YouTubeVideo', YouTubeVideo)
  }
}
