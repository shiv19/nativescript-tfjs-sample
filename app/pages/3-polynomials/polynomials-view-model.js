import { Observable } from "data/observable";

export function createViewModel() {
    const viewModel = new Observable();
    viewModel.scatterSource = [];
    viewModel.predictionBefore = [];
    viewModel.predictionAfter = [];
    viewModel.trueCoefficients = '';
    viewModel.randomCoefficients = '';
    viewModel.finalCoefficients = '';

    return viewModel;
}
