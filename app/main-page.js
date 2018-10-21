import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

import {
  BabySteps,
  StartToWalk,
  Polynomials,
  VideoProcessing,
  EmojiHunt,
  AudioProcessing
} from '~/shared/routes';

import * as permissions from 'nativescript-permissions';


export async function onNavigatedTo({
  isBackNavigation,
  object: page
}) {
  if (isBackNavigation) {
    return;
  }

  page.bindingContext = {
    examples: new ObservableArray([
      {
        name: 'Baby Steps',
        icon: '👶🏻',
        route: BabySteps,
      },
    ]),
    rest: [
      {
        name: 'Starting to Walk',
        icon: '🚶🏻‍♂️',
        route: StartToWalk,
      },
      {
        name: 'Polynomials',
        icon: '📈',
        route: Polynomials,
      },
      {
        name: 'Video Processing',
        icon: '📹',
        route: VideoProcessing,
      },
      {
        name: 'Emoji Hunt',
        icon: '🤠',
        route: EmojiHunt,
      },
      {
        name: 'Audio Processing',
        icon: '🎵',
        route: AudioProcessing
      },
    ],
    onItemTap({
      view,
      object
    }) {
      const { frame } = object.page;
      const { route } = view.bindingContext;

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
      if (this.rest.length === 1) {
        nextBtn.isEnabled = false;
      }

      prevBtn.isEnabled = true;
      this.examples.push(this.rest.shift());
    }
  }

  await permissions.requestPermissions([
    android.Manifest.permission.CAMERA,
    android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
    android.Manifest.permission.RECORD_AUDIO,
    android.Manifest.permission.MODIFY_AUDIO_SETTINGS
  ]);
}
