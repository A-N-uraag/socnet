import React from 'react';
import Particles from "react-tsparticles";
import { loadBaseMover } from "tsparticles-move-base";
import { loadCircleShape } from "tsparticles-shape-circle";
import { loadColorUpdater } from "tsparticles-updater-color";
import { loadEmittersPlugin } from "tsparticles-plugin-emitters";
import { loadOpacityUpdater } from "tsparticles-updater-opacity";
import { loadOutModesUpdater } from "tsparticles-updater-out-modes";
import { loadSizeUpdater } from "tsparticles-updater-size";
import { options } from './options';

export class ParticlesContainer extends React.Component {
  // this customizes the component tsParticles installation
  async customInit(engine) {
    // this adds the preset to tsParticles, you can safely use the
    await loadBaseMover(engine);
    await loadCircleShape(engine);
    await loadEmittersPlugin(engine);
    await loadColorUpdater(engine);
    await loadOpacityUpdater(engine);
    await loadOutModesUpdater(engine);
    await loadSizeUpdater(engine);
    await engine.addPreset("fountain", options);
  }

  render() {
    const options = {
      preset: 'fountain',
    };

    return <Particles className="particles" options={options} init={this.customInit} />;
  }
}