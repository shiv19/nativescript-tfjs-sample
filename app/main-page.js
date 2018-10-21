import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import {
    BabySteps,
    StartToWalk,
    Polynomials,
    VideoProcessing,
    EmojiHunt,
    AudioProcessing
} from '~/shared/routes';

import { isAndroid } from 'platform';

import * as permissions from 'nativescript-permissions';

const availablePages = [
    {
        name: 'Starting to Walk',
        icon: '🚶🏻‍♂️',
        route: StartToWalk
    },
    {
        name: 'Polynomials',
        icon: '📈',
        route: Polynomials
    }
];

if (isAndroid) {
  /**
   * The following samples only work on Android Currently
   */
  availablePages.push(...[
      {
          name: 'Video Processing',
          icon: '📹',
          route: VideoProcessing
      },
      {
          name: 'Emoji Hunt',
          icon: '🤠',
          route: EmojiHunt
      },
      {
          name: 'Audio Processing',
          icon: '🎵',
          route: AudioProcessing
      },
    ]
  )
}

export async function onNavigatedTo({ isBackNavigation, object: page }) {
    if (isBackNavigation) {
        return;
    }

    page.bindingContext = {
        examples: new ObservableArray([
            {
                name: 'Baby Steps',
                icon: '👶🏻',
                route: BabySteps
            }
        ]),
        rest: [...availablePages],
        onItemTap({ view, object }) {
            const page = object.page;
            const { frame } = page;
            const { route, name } = view.bindingContext;

            frame.navigate({
                moduleName: route,
                animated: true,
                transition: {
                    name: 'slide',
                    duration: 380,
                    curve: 'easeIn'
                }
            });
        },
        prev({ object }) {
            const prevBtn = object;
            const nextBtn = object.page.getViewById('nextBtn');
            if (this.examples.length === 2) {
                prevBtn.isEnabled = false;
            }

            nextBtn.isEnabled = true;
            this.rest.unshift(this.examples.pop());
        },
        next({ object }) {
            const nextBtn = object;
            const prevBtn = object.page.getViewById('prevBtn');
            const listView = object.page.getViewById('listView');
            if (this.rest.length === 1) {
                nextBtn.isEnabled = false;
            }

            prevBtn.isEnabled = true;
            this.examples.push(this.rest.shift());

            listView.scrollToIndexAnimated(this.examples.length);
        }
    };

    await permissions.requestPermissions([
        android.Manifest.permission.CAMERA,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
        android.Manifest.permission.RECORD_AUDIO,
        android.Manifest.permission.MODIFY_AUDIO_SETTINGS
    ]);
}
