import * as CookieConsent from 'vanilla-cookieconsent'

let iframeManager = null

export function getIframeManager() {
  return iframeManager
}

export async function initCookieConsent() {
  if (typeof window === 'undefined') return

  await import('@orestbida/iframemanager')
  iframeManager = window.iframemanager()

  iframeManager.run({
    currLang: 'it',
    services: {
      youtube: {
        embedUrl: 'https://www.youtube-nocookie.com/embed/{data-id}',
        thumbnailUrl: 'https://i3.ytimg.com/vi/{data-id}/hqdefault.jpg',
        iframe: {
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
        },
        languages: {
          it: {
            notice:
              'Questo contenuto è ospitato da YouTube. Caricandolo accetti le <a rel="noreferrer noopener" href="https://www.youtube.com/t/terms" target="_blank">condizioni d\'uso</a> di youtube.com.',
            loadBtn: 'Carica il video',
            loadAllBtn: 'Non chiedere più'
          }
        }
      }
    }
  })

  CookieConsent.run({
    mode: 'opt-in',
    autoShow: true,
    lazyHtmlGeneration: true,

    cookie: {
      name: 'nwaj_consent',
      expiresAfterDays: 182
    },

    guiOptions: {
      consentModal: {
        layout: 'box inline',
        position: 'bottom right',
        equalWeightButtons: true
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true
      }
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        enabled: false,
        autoClear: {
          cookies: [{ name: /^(_ga|_gid)/ }]
        }
      },
      marketing: {
        enabled: false,
        autoClear: {
          cookies: [
            { name: /^(_gc|_fb|_tt)/ },
            { name: 'IDE', domain: '.doubleclick.net' }
          ]
        }
      }
    },

    language: {
      default: 'it',
      translations: {
        it: {
          consentModal: {
            title: 'Utilizziamo i cookie',
            description:
              'Questo sito usa cookie tecnici necessari al funzionamento e, previo tuo consenso, cookie di analisi e di marketing per migliorare la tua esperienza. Puoi accettare tutto, rifiutare i non necessari o personalizzare le tue scelte.',
            acceptAllBtn: 'Accetta tutto',
            acceptNecessaryBtn: 'Solo necessari',
            showPreferencesBtn: 'Personalizza',
            footer:
              '<a href="/about/">Privacy policy</a>'
          },
          preferencesModal: {
            title: 'Preferenze cookie',
            acceptAllBtn: 'Accetta tutto',
            acceptNecessaryBtn: 'Solo necessari',
            savePreferencesBtn: 'Salva preferenze',
            closeIconLabel: 'Chiudi',
            serviceCounterLabel: 'Servizio|Servizi',
            sections: [
              {
                title: 'Come utilizziamo i cookie',
                description:
                  'I cookie ci aiutano a migliorare il sito e la tua esperienza di navigazione. Puoi scegliere per ogni categoria se dare o negare il consenso. Per maggiori dettagli consulta la nostra privacy policy.'
              },
              {
                title: 'Cookie strettamente necessari',
                description:
                  'Questi cookie sono essenziali per il corretto funzionamento del sito e non possono essere disattivati.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Cookie di analisi',
                description:
                  'Ci permettono di capire come i visitatori interagiscono con il sito, raccogliendo dati in forma anonima per migliorare contenuti e prestazioni.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: {
                    name: 'Nome',
                    domain: 'Dominio',
                    description: 'Descrizione',
                    duration: 'Durata'
                  },
                  body: [
                    {
                      name: '_ga',
                      domain: 'google.com',
                      description:
                        'Cookie utilizzato da Google Analytics per distinguere gli utenti.',
                      duration: '2 anni'
                    },
                    {
                      name: '_gid',
                      domain: 'google.com',
                      description:
                        'Cookie utilizzato da Google Analytics per distinguere gli utenti.',
                      duration: '24 ore'
                    }
                  ]
                }
              },
              {
                title: 'Cookie di marketing',
                description:
                  'Vengono utilizzati per tracciare i visitatori sui siti web al fine di mostrare annunci pertinenti e personalizzati. Includono anche i contenuti incorporati da terze parti come i video di YouTube.',
                linkedCategory: 'marketing',
                cookieTable: {
                  headers: {
                    name: 'Nome',
                    domain: 'Dominio',
                    description: 'Descrizione',
                    duration: 'Durata'
                  },
                  body: [
                    {
                      name: 'VISITOR_INFO1_LIVE',
                      domain: 'youtube.com',
                      description:
                        'Cookie impostato da YouTube per misurare la banda disponibile.',
                      duration: '6 mesi'
                    },
                    {
                      name: 'YSC',
                      domain: 'youtube.com',
                      description:
                        'Registra un identificativo unico per la sessione video.',
                      duration: 'Sessione'
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    },

    onFirstConsent({ cookie }) {
      syncIframeManager(cookie)
    },

    onConsent({ cookie }) {
      syncIframeManager(cookie)
    },

    onChange({ cookie }) {
      syncIframeManager(cookie)
    }
  })
}

function syncIframeManager(cookie) {
  if (!iframeManager) return

  const accepted = cookie.categories || []

  if (accepted.includes('marketing')) {
    iframeManager.acceptService('all')
  } else {
    iframeManager.rejectService('all')
  }
}

export function showCookiePreferences() {
  CookieConsent.showPreferences()
}
