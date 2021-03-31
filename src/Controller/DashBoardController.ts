import { DashboardModel } from '../Model/DashboardModel';
import { DashboardView } from '../View/DashboardView';
export class DashboardController extends Controller {
    private model: DashboardModel;
    private view: DashboardView;
    constructor(model: DashboardModel, view: DashboardView) {
        super();
        this.model = model;
        this.view = view;
        model.bindOnChange(this.view.render);
        model.onChange(model.getCurrentList());
    }
}