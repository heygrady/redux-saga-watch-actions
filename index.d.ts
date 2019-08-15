import { Action } from 'redux'
import { Saga } from 'redux-saga'
import { ActionPattern, AllEffect, ForkEffect, HelperWorkerParameters } from 'redux-saga/effects'
import { ActionMatchingPattern } from '@redux-saga/types'

export interface CombineSagas {
  <Args extends any[]>(...sagas: ReadonlyArray<Saga<Args>>): Saga<Args>
}

export const combineSagas: CombineSagas

export interface CreateWatcher {
  <P extends ActionPattern>(
    pattern: P,
    saga: (action: ActionMatchingPattern<P>) => IterableIterator<any>
  ): () => IterableIterator<ForkEffect>
  <P extends ActionPattern, Fn extends Saga>(pattern: P, saga: Fn): (
    ...args: HelperWorkerParameters<ActionMatchingPattern<P>, Fn>
  ) => IterableIterator<ForkEffect>
  <A extends Action>(
    pattern: ActionPattern<A>,
    saga: (action: A) => IterableIterator<any>
  ): () => IterableIterator<ForkEffect>
  <A extends Action, Fn extends Saga>(pattern: ActionPattern<A>, saga: Fn): (
    ...args: HelperWorkerParameters<A, Fn>
  ) => IterableIterator<ForkEffect>
}

export const createWatcher: CreateWatcher

type AppendActionToArgs<Args extends any[], A extends Action> = Args extends []
  ? [A]
  : Args extends [infer Arg1]
  ? [Arg1, A]
  : Args extends [infer Arg1, infer Arg2]
  ? [Arg1, Arg2, A]
  : Args extends [infer Arg1, infer Arg2, infer Arg3]
  ? [Arg1, Arg2, Arg3, A]
  : Args extends [infer Arg1, infer Arg2, infer Arg3, infer Arg4]
  ? [Arg1, Arg2, Arg3, Arg4, A]
  : any[]

interface ActionWithPayload<Type extends string, Payload> {
  readonly payload: Payload
  readonly type: Type
}

export type NarrowedAction<
  Actions extends Action,
  ActionType extends Actions['type']
> = {
  [K in Actions['type']]: Actions extends ActionWithPayload<K, infer Payload>
    ? ActionWithPayload<K, Payload>
    : never
}[ActionType]

export type SagaMap<A extends Action, Args extends any[]> = {
  readonly [P in A['type']]?: Saga<AppendActionToArgs<Args, NarrowedAction<A, P>>>
}

export interface WatchActions {
  <A extends Action, Args extends any[]>(sagaMap?: SagaMap<A, Args>): (
    ...args: Args
  ) => IterableIterator<AllEffect<IterableIterator<ForkEffect>>>
}

export const watchActions: WatchActions
