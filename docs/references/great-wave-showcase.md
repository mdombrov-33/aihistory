# Great Wave showcase source pack

Checked 2026-11-23 for **The Great Wave, Made by Hand**. Primary institutional sources and real collection images only. No paid provider calls or generated artwork were used. This is a focused source and asset handoff, not a complete account of ukiyo-e.

## Six core institutional sources

| Source | Supported claims and limits |
| --- | --- |
| [The Met: Under the Wave off Kanagawa, JP1847](https://www.metmuseum.org/art/collection/search/45434) | Hokusai's design belongs to *Thirty-six Views of Mount Fuji*. The museum dates this Japanese Edo-period woodblock print to **ca. 1830–32**, identifies ink and color on paper, and explains Fuji's small apparent size through perspective. Retain the approximate date. The existing local image represents this particular museum impression. |
| [Asian Art Museum: The Ukiyo-e (Woodblock) Printing Process](https://education.asianart.org/resources/the-ukiyo-e-woodblock-printing-process/) | Production involved publisher, artist, carver and printer. The publisher commissioned and distributed; the artist supplied a drawing; the carver removed wood around the lines; the printer rubbed damp paper against inked raised surfaces with a *baren*. Separate color blocks and *kento* registration marks aligned successive impressions. Edo is present-day Tokyo. This is a general process account: do not turn its average production figures into an exact Great Wave block count or edition size. |
| [The Met: The Great Wave: Anatomy of an Icon](https://www.metmuseum.org/essays/hokusai-great-wave) | Eijudo advertised the Fuji series around New Year 1831. The museum's research describes indigo mixed with Prussian blue in outlines and superimposed printing that deepened blue. Its account explicitly credits anonymous cutters and printers. It also uses a detail from a separate private-collection impression to discuss double printing. Describe the findings as the Met's analysis; the local JPEG cannot itself identify pigments, printing order, or microscopic paper relief. Do not generalize one fixed recipe to every impression. |
| [The Met: South Wind, Clear Sky / Red Fuji, JP9](https://www.metmuseum.org/art/collection/search/36490) | Another design from the Fuji series, ca. 1830–32; ink and color on paper. The museum's contextual note describes the series expanding to forty-six prints and identifies its new blue with pigment introduced by Dutch merchants. This supports material exchange through trade, without claiming that every pigment or this exact sheet followed a known route. The page's shared curatorial prose also discusses *Storm Below Fuji*; do not misassign those storm observations to Red Fuji. |
| [The Met: Ejiri in Suruga Province, JP2553](https://www.metmuseum.org/art/collection/search/56988) | Another Fuji-series woodblock print, ca. 1830–32, ink and color on paper. Its visible travelers, flying paper and distant mountain support an observation exercise about how a design suggests wind and makes Fuji a recurring visual anchor. Those observations are visual interpretation, not a claim that the print documents a dated event. |
| [The Walters Art Museum: Wooden Printing Block, 2011.11.1](https://art.thewalters.org/object/2011.11.1/) | An actual Japanese cherrywood block, **ca. 1900**, carved on both sides and used to produce a single-color image. The museum page explicitly marks its images Creative Commons Zero. Useful as a later process comparison only: it is not a Great Wave block, not Hokusai's tool, and not evidence for the exact blocks used in the 1830s. No local copy was saved because image downloads returned HTTP 403. |

## Authoring boundaries

- Make the work of hands visible: distinguish the designer's composition from carving, aligned color impressions and a publisher's production/distribution. No named carver or printer for this particular Great Wave impression is established by these sources.
- A print is a physical impression of a reproducible design. The app's digital image is a photograph of one surviving sheet. Avoid treating all copies, later reproductions and museum impressions as materially identical.
- Fuji links the series; compare its visual scale and placement across the Great Wave, Red Fuji and Ejiri. This is an editorial comparison grounded in the images, not proof of Hokusai's thoughts.
- Do not narrate a witnessed shipwreck, tsunami, casualty count, measured wave height or historical storm from the composition. The artwork is evidence of image-making, materials and representation; its scene does not establish those events.
- Keep the trade claim narrow: imported Prussian blue connects the print market to wider material circulation. These sources do not establish a shipment itinerary for the pigment used on JP1847.

## Downloaded historical assets

The Met object pages explicitly label these images **Public Domain**. [The Met's Open Access policy](https://www.metmuseum.org/hubs/open-access) makes such collection images available under CC0. Each adjacent `*.jpg.provenance.json` records the exact source URL, record, collection credit, dimensions, date, byte count, original download hash and final hash. A JPEG comment embeds the source origin; image pixels were not changed.

| Local asset | Exact object and download | Size and use |
| --- | --- | --- |
| `frontend/public/images/archive/great-wave.jpg` (existing) | [JP1847](https://www.metmuseum.org/art/collection/search/45434) · [JPEG](https://collectionapi.metmuseum.org/api/collection/v1/iiif/45434/134438/main-image) | 1200 × 807. Main artwork and inspectable detail. Existing file and provenance were retained. |
| `frontend/public/images/showcase/great-wave/red-fuji.jpg` | [JP9](https://www.metmuseum.org/art/collection/search/36490) · [JPEG](https://collectionapi.metmuseum.org/api/collection/v1/iiif/36490/140210/main-image) | 1200 × 827; 225,869 bytes. Broad red mountain, patterned clouds and tiny trees contrast with the wave composition. Credit: Rogers Fund, 1914. |
| `frontend/public/images/showcase/great-wave/ejiri-suruga.jpg` | [JP2553](https://www.metmuseum.org/art/collection/search/56988) · [JPEG](https://collectionapi.metmuseum.org/api/collection/v1/iiif/56988/140178/main-image) | 1200 × 807; 234,465 bytes. Travelers, bent vegetation and airborne paper offer a second visual account of motion. Credit: The Howard Mansfield Collection, Purchase, Rogers Fund, 1936. |

Both new files passed JPEG-signature, `file` and pixel-dimension checks and were visually inspected with `view_image`. No cropped details, simulated pigment photographs or process photographs have been substituted. If a process diagram is authored, label it an explanatory diagram rather than a reproduction of the lost original blocks.

## Optional block image provenance for future retrieval

The Walters' [published collection media CSV](https://github.com/WaltersArtMuseum/api-thewalters-org/blob/master/media.csv) maps accession 2011.11.1, media 86140, to [the exact front-view JPEG](https://art.thewalters.org/images/raw/PS1_2011.11.1_VwA_DD_AT18-014188-tms.jpg). Both its object page and the museum's [rights policy](https://thewalters.org/about/policies/rights-reproductions/) confirm CC0 for the image. Shell requests returned HTTP 403, so there is no verified local image, dimensions or hash for this optional object. Do not reference a nonexistent local file.
