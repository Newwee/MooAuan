'use client';

import React from 'react';
import { ActiveGameState, Player, MINI_GAMES, RpsChoice } from '@/types/game';
import { SameBrainGame } from './SameBrainGame';
import { TapBattleGame } from './TapBattleGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { RpsGame } from './RpsGame';
import { ResultsView } from '@/components/results/ResultsView';
import { ArrowLeft } from 'lucide-react';
import { sound } from '@/lib/audio';

interface GameContainerProps {
  activeGame: ActiveGameState;
  players: Player[];
  currentUserId: string;
  roomCode: string;
  onDispatchAction: (action: string, payload?: Record<string, unknown>) => void;
  onBackToLobby: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  activeGame,
  players,
  currentUserId,
  roomCode,
  onDispatchAction,
  onBackToLobby,
}) => {
  const meta = MINI_GAMES.find((m) => m.id === activeGame.type) || MINI_GAMES[0];

  // If game status is 'finished', display the Match Results celebration screen
  if (activeGame.status === 'finished') {
    return (
      <ResultsView
        activeGame={activeGame}
        players={players}
        currentUserId={currentUserId}
        roomCode={roomCode}
        onRematch={() => onDispatchAction('reset-to-lobby')}
        onNextGame={() => onDispatchAction('reset-to-lobby')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border-2 border-[#FFD2E2] shadow-sm">
        <button
          onClick={() => {
            sound.tap();
            onBackToLobby();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#716280] hover:text-[#41364F] px-2 py-1 rounded-xl hover:bg-[#FFEBF2] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> กลับล็อบบี้
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.icon}</span>
          <span className="text-sm font-black text-[#41364F]">{meta.titleTh}</span>
        </div>

        <div className="text-xs font-bold text-[#FF8EB2] bg-[#FFEBF2] px-2.5 py-1 rounded-full border border-[#FFD2E2]">
          ห้อง: {roomCode}
        </div>
      </div>

      {/* Render Active Mini Game */}
      {activeGame.type === 'same-brain' && activeGame.sameBrain && (
        <SameBrainGame
          state={activeGame.sameBrain}
          players={players}
          currentUserId={currentUserId}
          onSubmitAnswer={(optionId) =>
            onDispatchAction('same-brain-answer', { optionId })
          }
          onNextQuestion={() => onDispatchAction('same-brain-next')}
        />
      )}

      {activeGame.type === 'tap-battle' && activeGame.tapBattle && (
        <TapBattleGame
          state={activeGame.tapBattle}
          players={players}
          currentUserId={currentUserId}
          onSubmitTap={() => onDispatchAction('tap-submit')}
          onNextRound={() => onDispatchAction('tap-next-round')}
        />
      )}

      {activeGame.type === 'memory-match' && activeGame.memoryMatch && (
        <MemoryMatchGame
          state={activeGame.memoryMatch}
          players={players}
          currentUserId={currentUserId}
          onFlipCard={(cardId) => onDispatchAction('memory-flip', { cardId })}
          onResolveMismatch={() => onDispatchAction('memory-resolve-mismatch')}
        />
      )}

      {activeGame.type === 'rps' && activeGame.rps && (
        <RpsGame
          state={activeGame.rps}
          players={players}
          currentUserId={currentUserId}
          onSubmitChoice={(choice: RpsChoice) =>
            onDispatchAction('rps-choice', { choice })
          }
          onNextRound={() => onDispatchAction('rps-next-round')}
        />
      )}
    </div>
  );
};
