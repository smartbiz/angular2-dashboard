import {Component, OnInit} from 'angular2/core';
import {Menu, SearchService} from '../../shared/services/search.service';
import {RouteParams, Router} from 'angular2/router';
import {CanDeactivate, ComponentInstruction} from 'angular2/router';
@Component({
    selector: 'sd-edit',
    moduleId: module.id,
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, CanDeactivate {
    menu: Menu;
    editName:  string;
    editIcon:  string;
    editBadge: string;
    editState: string;

    constructor(
        private _service: SearchService,
        private _router: Router,
        private _routeParams: RouteParams
    ) { }

    ngOnInit() {
        // console.log('_routeParams.get:' + name);
        let name = this._routeParams.get('name');
        this._service.get(name).subscribe(menu => {
            if (menu) {
                this.editName  = menu.name;
                this.editIcon  = menu.icon;
                this.editBadge = menu.badge;
                this.editState = menu.state;
                this.menu = menu;
            } else {
                this.gotoList();
            }
        });
    }

    routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
        if (!this.menu || this.menu.name === this.editName || this.menu.icon === this.editIcon
            || this.menu.badge === this.editBadge || this.menu.state === this.editState ) {
            return true;
        }
        return new Promise<boolean>((resolve, reject) => resolve(window.confirm('Discard changes?')));
    }

    cancel() {
        this._router.navigate(['Search']);
    }

    save() {
        this.menu.name  = this.editName;
        this.menu.icon  = this.editIcon;
        this.menu.badge = this.editBadge;
        this.menu.state = this.editState;

        this._service.save(this.menu);
        this.gotoList();
    }

    gotoList() {
        if (this.menu) {
            this._router.navigate(['Search', { term: this.menu.name }]);
        } else {
            this._router.navigate(['Search']);
        }
    }

}
