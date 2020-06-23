import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { createEffect, Actions } from "@ngrx/effects";
import { ofEntityOp, persistOps, EntityAction, EntityOp } from "@ngrx/data";
import { map, tap } from "rxjs/operators";
import { Action } from '@ngrx/store';

// NOTE: EntityEffects are undocumented.  
// So far, it seems like it's a write all your own to override things otherwise, we'll simply have duplicates.
@Injectable()
export class CourseEntityEffects {
    normalize$: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofEntityOp(),
            tap((action) => {
                console.log('persist effect payload: ', action.payload);
            }),
            map((action: EntityAction) => {
                return {
                    type: '[Course] @ngrx/data/query-all',
                    payload: action, // the incoming action
                    entityName: action.payload.entityName,
                };
            })
        )
    );

    constructor(private actions: Actions<EntityAction>) { }
}