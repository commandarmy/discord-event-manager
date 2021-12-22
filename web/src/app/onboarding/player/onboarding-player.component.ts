import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Guild } from '../../guild/guild.service';
import { GuildRelationship, UserProfile, UserService } from '../../user/user.service';
import { WowService } from '../../wow/wow.service';


/** Onboarding process steps. */
enum Steps {
  LOADING = 0,
  DISCORD_AUTHENTICATION = 1,
  DISCORD_ASSOCIATION = 2,
  BATTLENET_AUTHENTICATION = 3,
  CHARACTER_ASSOCIATION = 4,
  COMPLETED = 5,
}
@Component({
  selector: 'app-onboarding-player',
  templateUrl: './onboarding-player.component.html',
  styleUrls: ['./onboarding-player.component.scss']
})
export class OnboardingPlayerComponent implements OnInit {
  /** Provides the enum to the template. */
  readonly Steps = Steps;
  /** The current step the user is at. */
  currentStep = Steps.LOADING;
  /** Whether the current step is loading. */
  loading = false;
  /** The current user selected. */
  selectedUser?: UserProfile;
  /** The current guild selected. */
  selectedGuild?: Guild;

  constructor(private readonly userService: UserService, private readonly wowService: WowService) { }

  ngOnInit() {
    this.loadNextStep();
  }

  onGuildSelected(relationship: GuildRelationship) {
    this.selectedGuild = relationship.guild;
    this.loadNextStep();
  }

  // Steps loader.

  /** All transitions and callbacks to load them. */
  private readonly TRANSITIONS = new Map<Steps, {loader: () => Promise<boolean>, next: Steps}>([
    [Steps.LOADING, {loader: () => this.loadDiscordAuthentication(), next: Steps.DISCORD_AUTHENTICATION}],
    [Steps.DISCORD_AUTHENTICATION, {loader: () => this.loadDiscordAssociation(), next: Steps.DISCORD_ASSOCIATION}],
    [Steps.DISCORD_ASSOCIATION, {loader: () => this.loadBattlenetAuthentication(), next: Steps.BATTLENET_AUTHENTICATION}]
  ]);

  /** Loads the next step. */
  async loadNextStep() {
    const next = this.TRANSITIONS.get(this.currentStep);
    if (!next) {
      return;
    }
    this.loading = true;
    const skippable = await next.loader();
    this.currentStep = next.next;
    if (skippable) {
      this.loadNextStep();
      return;
    }
    this.loading = false;
  }

  /** Loads the discord authentication step. Simply returns true if the user is authenticated. */
  async loadDiscordAuthentication(): Promise<boolean> {
    return firstValueFrom(this.userService.isAuthenticated());
  }

  /** Loads the guilds the player may associate to. If a single guild is availble, automatically select it. */
  async loadDiscordAssociation(): Promise<boolean> {
    this.selectedUser = await firstValueFrom(this.userService.getUserProfile());
    if (this.selectedUser?.guilds?.length === 1) {
      this.selectedGuild = this.selectedUser.guilds[0].guild;
      return true;
    }
    return false;
  }

  /** Loads the battlenet authentication step. Simply returns true if the user is authenticated. */
  async loadBattlenetAuthentication(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
